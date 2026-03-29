import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, MapPin, Phone, Clock, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
    return (
        <div className="flex flex-col">
            {/* Header Section */}
            <section className="bg-muted/30 py-20">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="mb-6 text-4xl font-bold">Parlons de votre projet</h1>
                        <p className="mb-8 text-xl text-muted-foreground">
                            Vous avez une idée, un besoin ou un projet structurant ?
                        </p>
                        <p className="text-lg font-medium">
                            Nos équipes sont prêtes à vous accompagner.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Grid */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
                        <Card className="text-center">
                            <CardHeader>
                                <div className="mx-auto mb-4 rounded-full bg-primary/10 p-4 w-fit">
                                    <Mail className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Email</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <a href="mailto:contact@maginot.app" className="text-muted-foreground hover:text-primary">
                                    contact@maginot.app
                                </a>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardHeader>
                                <div className="mx-auto mb-4 rounded-full bg-primary/10 p-4 w-fit">
                                    <Phone className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Téléphone</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <a href="tel:+213770998177" className="text-muted-foreground hover:text-primary">
                                    +213 7 70 99 81 77
                                </a>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardHeader>
                                <div className="mx-auto mb-4 rounded-full bg-primary/10 p-4 w-fit">
                                    <MapPin className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Adresse</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <a href="https://maps.app.goo.gl/7deXhhkRqahi83JX6" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                                    61 Rue Tahar Bouchedda,<br />
                                    El Harrach, Alger
                                </a>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardHeader>
                                <div className="mx-auto mb-4 rounded-full bg-primary/10 p-4 w-fit">
                                    <Clock className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Horaires</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">Lun - Ven : 9h - 17h</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main CTA */}
                    <div className="mt-16 text-center">
                        <Card className="mx-auto max-w-2xl bg-primary text-primary-foreground border-none">
                            <CardContent className="flex flex-col items-center p-12">
                                <MessageSquare className="mb-6 h-12 w-12 opacity-90" />
                                <h2 className="mb-6 text-3xl font-bold">Prêt à démarrer ?</h2>
                                <Button size="lg" className="px-8 bg-white text-primary hover:bg-white/90" asChild>
                                    <Link href="/register">
                                        Entrer en relation avec MAGINOT
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    )
}
