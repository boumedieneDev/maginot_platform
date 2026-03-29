import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Target,
    ShieldCheck,
    Briefcase,
    Handshake,
    Search,
    Compass,
    Cog,
    TrendingUp,
    ArrowRight
} from "lucide-react"

export default function AboutPage() {
    return (
        <div className="flex flex-col">
            {/* Intro Section */}
            <section className="bg-muted/30 py-20">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col gap-12 lg:flex-row lg:items-center">
                        <div className="flex-1 text-center lg:text-left">
                            <h1 className="mb-6 text-4xl font-bold">Qui sommes-nous ?</h1>
                            <p className="mb-8 text-xl text-muted-foreground">
                                MAGINOT est un groupe d’entrepreneurs, de stratèges et de professionnels issus de différents secteurs.
                            </p>
                            <p className="text-lg">
                                Nous croyons en une approche basée sur la structure, la rigueur et la vision long terme, loin des solutions superficielles.
                            </p>
                        </div>
                        <div className="flex-1">
                            {/* Image Placeholder */}
                            <div className="aspect-video w-full overflow-hidden rounded-2xl bg-background shadow-lg">
                                <img
                                    src="/images/profile-image.png"
                                    alt="L'équipe MAGINOT"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="mb-8 text-3xl font-bold">Notre Vision</h2>
                        <blockquote className="border-l-4 border-primary pl-6 text-2xl font-medium italic text-muted-foreground">
                            &quot;Construire un groupe de référence capable d’accompagner les projets ambitieux, de l’idée à l’impact réel sur le terrain.&quot;
                        </blockquote>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="bg-muted/30 py-20">
                <div className="container mx-auto px-4">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold">Nos Valeurs</h2>
                        <p className="text-muted-foreground">Les piliers de notre engagement</p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                        <div className="text-center p-6 bg-background rounded-xl shadow-sm">
                            <div className="mb-4 flex justify-center">
                                <Target className="h-10 w-10 text-primary" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold">Vision stratégique</h3>
                        </div>
                        <div className="text-center p-6 bg-background rounded-xl shadow-sm">
                            <div className="mb-4 flex justify-center">
                                <ShieldCheck className="h-10 w-10 text-primary" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold">Responsabilité</h3>
                        </div>
                        <div className="text-center p-6 bg-background rounded-xl shadow-sm">
                            <div className="mb-4 flex justify-center">
                                <Briefcase className="h-10 w-10 text-primary" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold">Exécution maîtrisée</h3>
                        </div>
                        <div className="text-center p-6 bg-background rounded-xl shadow-sm">
                            <div className="mb-4 flex justify-center">
                                <Handshake className="h-10 w-10 text-primary" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold">Partenariat durable</h3>
                        </div>
                    </div>
                </div>
            </section>

            {/* Methodology Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-3xl font-bold">NOTRE MÉTHODOLOGIE</h2>
                        <p className="text-muted-foreground">Une approche claire et structurée</p>
                    </div>

                    <div className="relative mx-auto max-w-4xl">
                        {/* Connecting line (desktop) */}
                        <div className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-border md:block"></div>

                        <div className="space-y-12">
                            {/* Step 1 */}
                            <div className="relative flex flex-col items-center md:flex-row md:items-start md:justify-between">
                                <div className="order-2 w-full pt-4 text-center md:flex-1 md:pr-12 md:text-right">
                                    <h3 className="text-xl font-bold text-primary">01 – Analyse & cadrage</h3>
                                    <p className="mt-2 text-muted-foreground">Compréhension globale du projet, des enjeux et des contraintes.</p>
                                </div>
                                <div className="order-1 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg md:order-2">
                                    <Search className="h-6 w-6" />
                                </div>
                                <div className="order-3 flex-1 md:pl-12"></div>
                            </div>

                            {/* Step 2 */}
                            <div className="relative flex flex-col items-center md:flex-row md:items-start md:justify-between">
                                <div className="order-3 flex-1 md:order-1 md:pr-12"></div>
                                <div className="order-1 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg md:order-2">
                                    <Compass className="h-6 w-6" />
                                </div>
                                <div className="order-2 w-full pt-4 text-center md:flex-1 md:order-3 md:pl-12 md:text-left">
                                    <h3 className="text-xl font-bold text-primary">02 – Structuration stratégique</h3>
                                    <p className="mt-2 text-muted-foreground">Définition des axes, des ressources et des priorités.</p>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="relative flex flex-col items-center md:flex-row md:items-start md:justify-between">
                                <div className="order-2 w-full pt-4 text-center md:flex-1 md:pr-12 md:text-right">
                                    <h3 className="text-xl font-bold text-primary">03 – Exécution opérationnelle</h3>
                                    <p className="mt-2 text-muted-foreground">Mise en œuvre coordonnée par nos pôles internes.</p>
                                </div>
                                <div className="order-1 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg md:order-2">
                                    <Cog className="h-6 w-6" />
                                </div>
                                <div className="order-3 flex-1 md:pl-12"></div>
                            </div>

                            {/* Step 4 */}
                            <div className="relative flex flex-col items-center md:flex-row md:items-start md:justify-between">
                                <div className="order-3 flex-1 md:order-1 md:pr-12"></div>
                                <div className="order-1 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg md:order-2">
                                    <TrendingUp className="h-6 w-6" />
                                </div>
                                <div className="order-2 w-full pt-4 text-center md:flex-1 md:order-3 md:pl-12 md:text-left">
                                    <h3 className="text-xl font-bold text-primary">04 – Suivi & optimisation</h3>
                                    <p className="mt-2 text-muted-foreground">Contrôle, ajustement et accompagnement continu.</p>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="mt-16 text-center">
                        <Button size="lg" asChild>
                            <Link href="/register">Démarrer votre projet avec MAGINOT</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* References & News Grid */}
            <section className="bg-muted/30 py-20">
                <div className="container mx-auto px-4">
                    <div className="grid gap-12 lg:grid-cols-2">
                        {/* References */}
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold">RÉFÉRENCES & REALISATIONS</h2>
                            <h3 className="text-xl font-semibold">Projets accompagnés</h3>
                            <p className="text-muted-foreground">
                                MAGINOT intervient sur des projets variés, couvrant plusieurs secteurs d’activité, avec une approche confidentielle et professionnelle.
                            </p>
                            <Button variant="outline" asChild>
                                <Link href="/contact">Découvrir des projets accompagnés</Link>
                            </Button>
                        </div>

                        {/* News */}
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold">ACTUALITÉS & INSIGHTS</h2>
                            <ul className="space-y-2 text-muted-foreground">
                                <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4 text-primary" /> Analyses de projets</li>
                                <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4 text-primary" /> Retours d’expérience</li>
                                <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4 text-primary" /> Tendances sectorielles</li>
                                <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4 text-primary" /> Vision entrepreneuriale</li>
                            </ul>
                            <Button variant="outline" asChild>
                                <Link href="/contact">Explorer nos analyses</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
