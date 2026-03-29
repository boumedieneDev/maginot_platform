import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createBuildClient } from "@/lib/supabase/server"
import { ArrowRight, CheckCircle, Shield, Zap, Users } from "lucide-react"
import { ServiceSlider } from "@/components/service-slider"
import { PoleSlider } from "@/components/pole-slider"

export default async function HomePage() {
    const supabase = createBuildClient()

    // Fetch Poles
    const { data: poles } = await supabase
        .from('poles')
        .select('*')
        .order('display_order', { ascending: true })

    // Fetch featured services
    const { data: services } = await supabase
        .from('services')
        .select('*, poles(name)')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .limit(10)

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 md:py-32 overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col gap-12 lg:flex-row lg:items-center">
                        <div className="flex-1 text-center lg:text-left">
                            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
                                MAGINOT construit, structure et développe des projets à fort impact.
                            </h1>
                            <p className="mb-8 text-lg text-muted-foreground md:text-2xl">
                                Un groupe pluridisciplinaire au service des entreprises, investisseurs et porteurs de projets.
                            </p>
                            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                                <Button size="lg" asChild>
                                    <Link href="/register">
                                        Demander un service
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" asChild>
                                    <Link href="/services">Découvrir nos services</Link>
                                </Button>
                            </div>
                        </div>
                        <div className="flex-1">
                            {/* Image Placeholder */}
                            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted shadow-2xl">
                                <img
                                    src="/images/construction.jpg"
                                    alt="MAGINOT Projets"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Poles Highlights Slider */}
            <section className="py-16 bg-muted/10">
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto">
                        {poles && poles.length > 0 ? (
                            <PoleSlider poles={poles} />
                        ) : (
                            <div className="text-center text-muted-foreground py-12">
                                Nos pôles d'expertise seront bientôt disponibles
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Strategic Presentation */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:flex-row-reverse">
                        <div className="flex-1 lg:text-left">
                            <h2 className="mb-4 text-3xl font-bold text-primary">Présentation stratégique</h2>
                            <div className="space-y-6 text-lg text-muted-foreground">
                                <p>
                                    MAGINOT est un groupe structuré (SARL) opérant à travers plusieurs pôles d’expertise complémentaires.
                                </p>
                                <p>
                                    Nous intervenons de l’idée à la réalisation, en accompagnant les organisations dans la conception, le développement, la valorisation et l’exécution de leurs projets.
                                </p>
                                <p className="font-medium text-foreground">
                                    Notre force réside dans une vision globale, une exécution maîtrisée et une capacité à coordonner différents métiers au sein d’un même écosystème.
                                </p>
                            </div>
                            <div className="mt-8">
                                <Button variant="outline" size="lg" asChild>
                                    <Link href="/about">Découvrir notre vision</Link>
                                </Button>
                            </div>
                        </div>
                        <div className="flex-1">
                            {/* Image Placeholder */}
                            <div className="aspect-square w-full max-w-md mx-auto overflow-hidden rounded-2xl bg-muted shadow-xl">
                                <img
                                    src="/images/hero-image.jpg"
                                    alt="MAGINOT Stratégie"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Figures */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="mb-12 text-center">
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        <div className="text-center p-6 bg-background rounded-lg shadow-sm">
                            <div className="text-4xl font-bold text-primary mb-2">+120</div>
                            <div className="text-lg font-medium">Projets structurés et réalisés</div>
                        </div>
                        <div className="text-center p-6 bg-background rounded-lg shadow-sm">
                            <div className="text-4xl font-bold text-primary mb-2">+10</div>
                            <div className="text-lg font-medium">Domaines d&apos;expertise intégrés</div>
                        </div>
                        <div className="text-center p-6 bg-background rounded-lg shadow-sm">
                            <div className="text-4xl font-bold text-primary mb-2">98 %</div>
                            <div className="text-lg font-medium">De satisfaction client</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Highlights */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold">Services à la Une</h2>
                        <p className="text-muted-foreground">
                            Découvrez nos services les plus demandés à travers nos différents pôles.
                        </p>
                    </div>

                    <div className="max-w-6xl mx-auto">
                        {services && services.length > 0 ? (
                            <ServiceSlider services={services} />
                        ) : (
                            <div className="text-center text-muted-foreground py-12">
                                Nos services seront bientôt disponibles
                            </div>
                        )}
                    </div>

                    <div className="mt-12 text-center">
                        <Button variant="outline" size="lg" asChild>
                            <Link href="/services">Découvrir tous nos pôles</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}
