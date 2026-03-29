import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createBuildClient } from "@/lib/supabase/server"
import { ArrowRight, CheckCircle } from "lucide-react"

interface ServiceDetailPageProps {
    params: {
        slug: string
    }
}

export async function generateStaticParams() {
    const supabase = createBuildClient()
    const { data: services } = await supabase
        .from('services')
        .select('slug')
        .eq('is_active', true)

    return services?.map((service) => ({
        slug: service.slug,
    })) || []
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
    const supabase = createBuildClient()

    const { data: service, error } = await supabase
        .from('services')
        .select('*')
        .eq('slug', params.slug)
        .eq('is_active', true)
        .single()

    if (error || !service) {
        notFound()
    }

    const { data: offres } = await supabase
        .from('offres')
        .select(`*, offre_features(feature_text)`)
        .eq('service_id', service.id)
        .eq('status', 'Active')
        .order('display_order', { ascending: true })

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/services"
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                        ← Retour aux services
                    </Link>
                </div>

                {/* Service Details */}
                <div className="mb-8">
                    {/* Image Banner */}
                    <div className="mb-6 aspect-video w-full overflow-hidden rounded-lg bg-muted">
                        {service.image_url ? (
                            <img
                                src={service.image_url}
                                alt={service.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                                <span className="text-lg">Image du Service</span>
                            </div>
                        )}
                    </div>

                    <h1 className="mb-4 text-4xl font-bold">{service.name}</h1>
                    <p className="text-lg text-muted-foreground">{service.description}</p>
                </div>

                {/* Service Information Card */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Description Détaillée</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="prose prose-slate max-w-none dark:prose-invert">
                            {service.details ? (
                                <p className="whitespace-pre-line">{service.details}</p>
                            ) : (
                                <p>Aucune description détaillée disponible.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Additional Dynamic Details */}
                {service.additional_details && Array.isArray(service.additional_details) && (
                    <div className="space-y-8 mb-8">
                        {(service.additional_details as any[]).map((detail, index) => (
                            <Card key={index}>
                                <CardHeader>
                                    <CardTitle>{detail.title || 'Détails supplémentaires'}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="prose prose-slate max-w-none dark:prose-invert">
                                        <p className="whitespace-pre-line">{detail.content || ''}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Offres Card Grid */}
                {offres && offres.length > 0 && (
                    <div className="mb-12">
                        <h2 className="mb-6 text-2xl font-bold">Nos Formules</h2>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {offres.map((offre) => (
                                <Card key={offre.id} className="flex flex-col relative overflow-hidden transition-all hover:shadow-lg border-primary/20">
                                    <CardHeader className="bg-muted/30 pb-4 text-center">
                                        {offre.badge && (
                                            <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                                                {offre.badge}
                                            </div>
                                        )}
                                        <CardTitle className="text-xl mt-4">{offre.title}</CardTitle>
                                        <div className="mt-4 flex justify-center items-end gap-1">
                                            {offre.price !== null ? (
                                                <>
                                                    <span className="text-4xl font-extrabold">{offre.price}</span>
                                                    <span className="font-semibold text-muted-foreground">{offre.currency}</span>
                                                </>
                                            ) : (
                                                <span className="text-2xl font-bold">Sur devis</span>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-1 pt-6 pb-6 px-8 sm:px-10">
                                        <ul className="grid gap-3">
                                            {offre.offre_features?.map((feature: any, i: number) => (
                                                <li key={i} className="flex items-start gap-3 text-sm">
                                                    <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                                                    <span className="text-left leading-snug">{feature.feature_text}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                    <div className="p-6 mt-auto">
                                        <Button className="w-full" asChild>
                                            <Link href={`/register?service=${service.slug}&offre=${offre.id}`}>
                                                Choisir cette offre
                                            </Link>
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* CTA Fallback if no offres are defined */}
                {(!offres || offres.length === 0) && (
                    <div className="rounded-lg bg-primary/10 p-8 text-center mb-8">
                        <h2 className="mb-4 text-2xl font-bold">
                            Intéressé par ce Service ?
                        </h2>
                        <p className="mb-6 text-muted-foreground">
                            Contactez-nous pour en savoir plus ou demander un devis.
                        </p>
                        <Button size="lg" asChild>
                            <Link href={`/register?service=${service.slug}`}>
                                S&apos;inscrire pour ce service
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                )}

                {/* Consultation CTA */}
                <div className="rounded-xl border bg-card text-card-foreground shadow border-primary/20 p-8 text-center mt-12">
                    <h2 className="mb-4 text-2xl font-bold">
                        Besoin d&apos;une consultation pour votre projet ?
                    </h2>
                    <p className="mb-6 text-muted-foreground max-w-2xl mx-auto">
                        Vous ne savez pas par où commencer ou quels sont les besoins exacts de votre site web ?
                        Nos experts sont là pour analyser votre situation et vous guider.
                    </p>
                    <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white transition-colors" asChild>
                        <Link href={`/register?service=${service.slug}&consultation=true`}>
                            Planifier une consultation gratuite
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
