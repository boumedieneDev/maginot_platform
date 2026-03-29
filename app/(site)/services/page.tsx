import { Suspense } from "react"
import { createBuildClient } from "@/lib/supabase/server"
import { ServicesList } from "@/components/services-list"

export default async function ServicesPage() {
    const supabase = createBuildClient()

    // Fetch poles for the tabs
    const { data: poles } = await supabase
        .from('poles')
        .select('*')
        .order('display_order', { ascending: true })

    // Fetch all active services
    const { data: allServices } = await supabase
        .from('services')
        .select('*, poles(name, slug)')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

    return (
        <Suspense fallback={<div className="container mx-auto px-4 py-12 text-center text-muted-foreground">Chargement des services...</div>}>
            <ServicesList initialServices={allServices || []} poles={poles || []} />
        </Suspense>
    )
}
