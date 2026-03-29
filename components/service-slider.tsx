"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronLeft, ChevronRight, Building2 } from "lucide-react"
import { Database } from "@/types/database"

type Service = Database['public']['Tables']['services']['Row'] & { poles?: { name: string } | null }

interface ServiceSliderProps {
    services: Service[]
}

export function ServiceSlider({ services }: ServiceSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [visibleItems, setVisibleItems] = useState(3)
    const [isTransitioning, setIsTransitioning] = useState(true)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Duplicate services for infinite loop
    const extendedServices = [...services, ...services.slice(0, 3)]

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setVisibleItems(1)
            } else if (window.innerWidth < 1024) {
                setVisibleItems(2)
            } else {
                setVisibleItems(3)
            }
        }

        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    const maxIndex = Math.max(0, services.length - visibleItems)

    const next = () => {
        if (currentIndex >= services.length) {
            // Reset to 0 without transition
            setIsTransitioning(false)
            setCurrentIndex(0)
            // Then move to 1 with transition in the next tick
            setTimeout(() => {
                setIsTransitioning(true)
                setCurrentIndex(1)
            }, 50)
        } else {
            setIsTransitioning(true)
            setCurrentIndex((prev) => prev + 1)
        }
    }

    const prev = () => {
        if (currentIndex <= 0) {
            setIsTransitioning(false)
            setCurrentIndex(services.length)
            setTimeout(() => {
                setIsTransitioning(true)
                setCurrentIndex(services.length - 1)
            }, 50)
        } else {
            setIsTransitioning(true)
            setCurrentIndex((prev) => prev - 1)
        }
    }

    // Auto-scroll forward only
    useEffect(() => {
        timeoutRef.current = setInterval(next, 4000)
        return () => {
            if (timeoutRef.current) clearInterval(timeoutRef.current)
        }
    }, [currentIndex, services.length])

    if (!services || services.length === 0) return null

    return (
        <div className="relative group">
            <div className="overflow-hidden px-1">
                <div
                    className={`flex ${isTransitioning ? "transition-transform duration-700 ease-in-out" : ""}`}
                    style={{
                        transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`
                    }}
                >
                    {extendedServices.map((service, idx) => (
                        <div
                            key={`${service.id}-${idx}`}
                            className="w-full shrink-0 px-3"
                            style={{ width: `${100 / visibleItems}%` }}
                        >
                            <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-xl border-slate-200/60 overflow-hidden group/card">
                                <div className="aspect-video w-full relative overflow-hidden bg-slate-100">
                                    {service.image_url ? (
                                        <img
                                            src={service.image_url}
                                            alt={service.name}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-slate-300">
                                            <Building2 className="h-12 w-12 opacity-20" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                                        {service.poles?.name && (
                                            <span className="bg-white/95 text-primary backdrop-blur-sm text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                                                {service.poles.name}
                                            </span>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                        <span className="text-white text-sm font-medium">En savoir plus</span>
                                    </div>
                                </div>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xl font-bold group-hover/card:text-primary transition-colors">
                                        {service.name}
                                    </CardTitle>
                                    <CardDescription className="line-clamp-2 min-h-[3rem]">
                                        {service.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="mt-auto pt-4">
                                    <Button variant="outline" className="w-full group/btn" asChild>
                                        <Link href={`/services/${service.slug}`}>
                                            Découvrir
                                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            <button
                onClick={(e) => {
                    e.preventDefault()
                    prev()
                }}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 h-12 w-12 rounded-full bg-white border shadow-lg flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-all z-10 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                aria-label="Previous slide"
            >
                <ChevronLeft className="h-6 w-6" />
            </button>
            <button
                onClick={(e) => {
                    e.preventDefault()
                    next()
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 h-12 w-12 rounded-full bg-white border shadow-lg flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-all z-10 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                aria-label="Next slide"
            >
                <ChevronRight className="h-6 w-6" />
            </button>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
                {services.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            setIsTransitioning(true)
                            setCurrentIndex(i)
                        }}
                        className={`h-2 transition-all rounded-full ${(currentIndex % services.length) === i ? "w-8 bg-primary" : "w-2 bg-slate-300 hover:bg-slate-400"
                            }`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}
