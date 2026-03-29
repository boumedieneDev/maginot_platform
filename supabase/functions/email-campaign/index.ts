import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, prefer',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const body = await req.json().catch(() => ({}))
        const { templateId, recipientType, targetServiceId, testEmail, customerIds } = body
        
        console.log("Processing campaign request:", { templateId, recipientType, targetServiceId, testEmail, customerIds })

        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        const supabaseClient = createClient(supabaseUrl, supabaseServiceKey)

        // 1. Fetch the Template
        if (!templateId) throw new Error("ID du modèle manquant")

        const { data: template, error: templateError } = await supabaseClient
            .from('email_templates')
            .select('*')
            .eq('id', templateId)
            .single()

        if (templateError || !template) {
            console.error("Template fetch error:", templateError)
            throw new Error("Modèle d'email non trouvé")
        }

        // 2. Fetch Recipients
        let recipients: any[] = []
        if (recipientType === 'test') {
            if (!testEmail) throw new Error("Email de test manquant")
            recipients = [{ email: testEmail, full_name: 'Test user', created_at: new Date().toISOString() }]
        } else if (recipientType === 'custom' && customerIds && customerIds.length > 0) {
            const { data, error: fetchError } = await supabaseClient
                .from('customers')
                .select('*')
                .in('id', customerIds)
            if (fetchError) throw fetchError
            recipients = data || []
        } else if (recipientType === 'all') {
            // Target customers table for "All" to ensure uniqueness by default
            const { data, error: fetchError } = await supabaseClient
                .from('customers')
                .select('*')
            if (fetchError) throw fetchError
            recipients = data || []
        } else {
            // Filtered leads (e.g. service_leads)
            let query = supabaseClient.from('leads').select('*').eq('is_visible', true)
            if (recipientType === 'service_leads' && targetServiceId) {
                query = query.eq('service_id', targetServiceId)
            }
            const { data, error: fetchError } = await query
            if (fetchError) throw fetchError
            recipients = data || []
        }

        // 2.1 Final Force Uniqueness by Email (Highly Aggressive)
        const recipientMap = new Map()
        for (const r of recipients) {
            if (r.email) {
                const emailKey = r.email.toLowerCase().trim()
                if (!recipientMap.has(emailKey)) {
                    recipientMap.set(emailKey, r)
                }
            }
        }
        recipients = Array.from(recipientMap.values())
        
        console.log(`Aggressive Dedup: Found ${recipients.length} unique emails for type ${recipientType}`)

        if (recipients.length === 0) {
            return new Response(JSON.stringify({ success: true, count: 0, message: 'Aucun destinataire unique trouvé.' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        // 2.2 Skip those who already have a PENDING email for this template in the queue
        const { data: existingPending } = await supabaseClient
            .from('email_queue')
            .select('to_email')
            .eq('status', 'pending')
            .eq('payload->>templateId', templateId)
        
        const alreadyPendingEmails = new Set((existingPending || []).map(p => p.to_email?.toLowerCase().trim()))

        // 3. Fetch services for variable mapping
        const { data: services } = await supabaseClient.from('services').select('id, name')
        const serviceMap = (services || []).reduce((acc: any, s: any) => {
            acc[s.id] = s.name
            return acc
        }, {})

        // 4. Add each email to the queue (Filtering out already pending)
        const queueEntries = recipients
            .filter(r => !alreadyPendingEmails.has(r.email?.toLowerCase().trim()))
            .map((recipient: any) => {
                const variables: Record<string, string> = {
                    '{{form_name}}': recipient.service_id ? serviceMap[recipient.service_id] : "Notre plateforme",
                    '{{submission_date}}': recipient.created_at ? new Date(recipient.created_at).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR'),
                    '{{submitter_name}}': recipient.full_name || "Client",
                    '{{email}}': recipient.email || "",
                    '{{phone}}': recipient.phone || "",
                    '{{company_name}}': recipient.company_name || "",
                }

                const parse = (text: string) => {
                    if (!text) return ""
                    let result = text
                    for (const [key, value] of Object.entries(variables)) {
                        result = result.split(key).join(value || "")
                    }
                    return result
                }

                return {
                    queue_type: recipientType === 'test' ? 'test' : 'campaign',
                    to_email: recipient.email.toLowerCase().trim(),
                    subject: parse(template.subject),
                    html: parse(template.html_body),
                    from_name: template.from_name,
                    from_email: template.from_email,
                    status: 'pending',
                    attempts: 0,
                    payload: { templateId, recipientType, targetServiceId },
                    updated_at: new Date().toISOString()
                }
            })

        console.log(`Inserting ${queueEntries.length} NEW unique items into email_queue (Filtered ${alreadyPendingEmails.size} already pending)...`)

        if (queueEntries.length === 0) {
            return new Response(JSON.stringify({
                success: true,
                count: 0,
                message: 'Tous les destinataires ont déjà ce message en attente dans la file.'
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        const { error: insertError } = await supabaseClient
            .from('email_queue')
            .insert(queueEntries)

        if (insertError) {
            console.error("Queue insert error:", insertError)
            throw insertError
        }

        return new Response(JSON.stringify({
            success: true,
            count: queueEntries.length,
            message: `${queueEntries.length} emails ajoutés à la file d'attente.`
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

    } catch (error: any) {
        console.error("Error in email-campaign:", error)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        })
    }
})
