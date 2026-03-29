import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, prefer',
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function sendViaResend(
    apiKey: string,
    to: string,
    from: string,
    fromName: string,
    subject: string,
    html: string
): Promise<void> {
    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from: `${fromName} <${from}>`,
            to: [to],
            subject,
            html,
        }),
    })

    const result = await response.json()

    if (!response.ok) {
        throw new Error(`Resend API error: ${result.message || JSON.stringify(result)}`)
    }
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const body = await req.json().catch(() => ({}))
        const batchSize = Math.min(Number(body.limit ?? 10), 20)
        const targetId = body.id
        const targetIds = body.ids
        
        console.log("Worker request body:", JSON.stringify(body))

        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        const resendApiKey = Deno.env.get('RESEND_API_KEY') ?? ''

        if (!resendApiKey) {
            throw new Error('RESEND_API_KEY is not set in Supabase Function Secrets.')
        }

        const supabaseClient = createClient(supabaseUrl, supabaseServiceKey)
        let query = supabaseClient.from('email_queue').select('*')

        if (targetId) {
            console.log(`Targeting single ID: ${targetId}`)
            query = query.eq('id', targetId)
        } else if (targetIds && Array.isArray(targetIds) && targetIds.length > 0) {
            console.log(`Targeting batch of ${targetIds.length} IDs:`, targetIds)
            query = query.in('id', targetIds)
        } else {
            console.log("Mode: Pending batch (Limit 10)")
            query = query.eq('status', 'pending').lt('attempts', 3).limit(batchSize)
        }

        const { data: queueItems, error: queueError } = await query.order('created_at', { ascending: true })
        
        console.log(`Found ${queueItems?.length || 0} items to process`)

        if (queueError) throw queueError

        if (!queueItems || queueItems.length === 0) {
            return new Response(JSON.stringify({
                success: true,
                processed: 0,
                sent: 0,
                failed: 0,
                message: 'No pending emails found.'
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            })
        }

        let sent = 0
        let failed = 0
        const delayMs = Number(body.delaySeconds ?? 0.3) * 1000

        for (const item of queueItems) {
            try {
                const trackedHtml = `${item.html}<img src="${supabaseUrl.replace(/\/$/, '')}/functions/v1/email-open?id=${item.id}" width="1" height="1" style="display:none" alt="" />`

                await sendViaResend(
                    resendApiKey,
                    item.to_email,
                    item.from_email || 'contact@maginot.app',
                    item.from_name || 'Maginot Platform',
                    item.subject,
                    trackedHtml
                )

                await supabaseClient
                    .from('email_queue')
                    .update({
                        status: 'sent',
                        sent_at: new Date().toISOString(),
                        last_error: null,
                        attempts: item.attempts + 1,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', item.id)

                sent += 1
                console.log(`✅ Sent to ${item.to_email}`)
            } catch (error: any) {
                const nextAttempts = (item.attempts || 0) + 1
                const nextStatus = nextAttempts >= 3 ? 'failed' : 'pending'

                await supabaseClient
                    .from('email_queue')
                    .update({
                        status: nextStatus,
                        attempts: nextAttempts,
                        last_error: error.message,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', item.id)

                failed += 1
                console.error(`❌ Failed to send to ${item.to_email}: ${error.message}`)
            }

            if (queueItems.length > 1) {
                await sleep(delayMs)
            }
        }

        return new Response(JSON.stringify({
            success: true,
            processed: queueItems.length,
            sent,
            failed,
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error: any) {
        console.error("Error in email-worker:", error)
        return new Response(JSON.stringify({
            success: false,
            error: error.message
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        })
    }
})
