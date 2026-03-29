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
        const { leadDetails, serviceId, serviceName } = await req.json()

        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        const supabaseClient = createClient(supabaseUrl, supabaseServiceKey)

        // 1. Fetch Template
        let template = null
        if (serviceId) {
            const { data } = await supabaseClient
                .from('email_templates')
                .select('*')
                .eq('service_id', serviceId)
                .eq('status', 'Active')
                .maybeSingle()
            template = data
        }

        if (!template) {
            const { data } = await supabaseClient
                .from('email_templates')
                .select('*')
                .eq('is_global_default', true)
                .eq('status', 'Active')
                .maybeSingle()
            template = data
        }

        if (!template) {
            return new Response(JSON.stringify({
                success: false,
                message: 'No active email template found. No email queued.'
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 404,
            })
        }

        // 2. Variable Mapping
        const variables = {
            '{{form_name}}': serviceName || "Notre service",
            '{{submission_date}}': new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
            '{{submitter_name}}': leadDetails.full_name || "Client",
            '{{email}}': leadDetails.email || "",
            '{{phone}}': leadDetails.phone || "",
            '{{company_name}}': leadDetails.company_name || "",
        }

        const parse = (text: string) => {
            if (!text) return ""
            return Object.entries(variables).reduce(
                (acc, [key, value]) => acc.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), value || ""),
                text
            )
        }

        const queuePayload = {
            queue_type: 'trigger',
            to_email: leadDetails.email,
            subject: parse(template.subject),
            html: parse(template.html_body),
            from_name: template.from_name,
            from_email: template.from_email,
            status: 'pending',
            attempts: 0,
            payload: {
                leadDetails,
                serviceId,
                serviceName,
                templateId: template.id,
                templateName: template.name,
            },
            updated_at: new Date().toISOString()
        }

        const { data, error } = await supabaseClient
            .from('email_queue')
            .insert([queuePayload])
            .select()
            .single()

        if (error) throw error

        return new Response(JSON.stringify({
            success: true,
            message: 'Notification added to queue successfully',
            data
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error: any) {
        console.error("Error in email-trigger:", error)
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        })
    }
})
