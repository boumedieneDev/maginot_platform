import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
            },
        })
    }

    try {
        const url = new URL(req.url)
        const id = url.searchParams.get('id')

        if (!id) {
            return new Response('Missing id', { status: 400 })
        }

        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

        if (supabaseUrl && supabaseServiceKey) {
            const supabase = createClient(supabaseUrl, supabaseServiceKey)
            const { data: current } = await supabase
                .from('email_queue')
                .select('open_count')
                .eq('id', id)
                .single()

            if (current) {
                await supabase
                    .from('email_queue')
                    .update({
                        opened_at: new Date().toISOString(),
                        open_count: (current.open_count || 0) + 1,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', id)
            }
        }

        const pixel = new Uint8Array([
            71,73,70,56,57,97,1,0,1,0,128,0,0,255,255,255,0,0,0,33,249,4,1,0,0,0,0,
            44,0,0,0,0,1,0,1,0,0,2,2,68,1,0,59
        ])

        return new Response(pixel, {
            status: 200,
            headers: {
                'Content-Type': 'image/gif',
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
                'Access-Control-Allow-Origin': '*',
            },
        })
    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            error: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    }
})
