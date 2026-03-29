"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Building2 } from "lucide-react"

interface ServicesListProps {
    initialServices: any[]
    poles: any[]
}

export function ServicesList({ initialServices, poles }: ServicesListProps) {
    const searchParams = useSearchParams()
    const activePole = searchParams.get('pole') || "all"

    const services = activePole === "all"
        ? initialServices
        : initialServices.filter(s => s.poles?.slug === activePole)

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-8">
                <h1 className="mb-4 text-4xl font-bold">Nos Services</h1>
                <p className="text-lg text-muted-foreground">
                    Découvrez l&apos;ensemble de nos services professionnels adaptés à vos besoins
                </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-12 border-b pb-4">
                <Button
                    variant={activePole === "all" ? "default" : "outline"}
                    className="rounded-full"
                    asChild
                >
                    <Link href="/services">
                        Tous les services
                    </Link>
                </Button>
                {poles?.map(pole => (
                    <Button
                        key={pole.id}
                        variant={activePole === pole.slug ? "default" : "outline"}
                        className="rounded-full"
                        asChild
                    >
                        <Link href={`/services?pole=${pole.slug}`}>
                            {pole.name}
                        </Link>
                    </Button>
                ))}
            </div>

            {services && services.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => (
                        <Card key={service.id} className="flex flex-col transition-shadow hover:shadow-lg overflow-hidden">
                            <div className="aspect-video w-full bg-muted relative">
                                {service.image_url ? (
                                    <img
                                        src={service.image_url}
                                        alt={service.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                                        <Building2 className="h-12 w-12 opacity-20" />
                                    </div>
                                )}
                                {service.poles?.name && (
                                    <div className="absolute top-4 left-4 z-10">
                                        <span className="bg-white/95 text-primary backdrop-blur-sm shadow-sm text-xs font-semibold px-3 py-1.5 rounded-full">
                                            {service.poles.name}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <CardHeader>
                                <CardTitle>{service.name}</CardTitle>
                                <CardDescription className="line-clamp-3">
                                    {service.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="mt-auto space-y-3">
                                <Button className="w-full" asChild>
                                    <Link href={`/services/${service.slug}`}>
                                        Découvrir
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/5 text-primary" asChild>
                                    <Link href={`/register?service=${service.slug}&consultation=true`}>
                                        Demander une consultation
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">
                            Aucun service disponible pour le moment.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
