"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, ChevronLeft, ChevronRight, Users } from "lucide-react"
import { Database } from "@/types/database"

type Pole = Database['public']['Tables']['poles']['Row']

interface PoleSliderProps {
    poles: Pole[]
}

export function PoleSlider({ poles }: PoleSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [visibleItems, setVisibleItems] = useState(3)
    const [isTransitioning, setIsTransitioning] = useState(true)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Ensure we have enough items for infinite scroll (need at least 1 screen worth of extra items)
    // If we have few poles, we might need to duplicate them more times
    const extendedPoles = [...poles, ...poles, ...poles].slice(0, poles.length + 4)

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setVisibleItems(1)
            } else if (window.innerWidth < 1024) {
                setVisibleItems(2)
            } else if (window.innerWidth < 1280) {
                setVisibleItems(3)
            } else {
                setVisibleItems(4)
            }
        }

        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    const maxIndex = Math.max(0, poles.length - visibleItems)

    const next = () => {
        if (currentIndex >= poles.length) {
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
            setCurrentIndex(poles.length)
            setTimeout(() => {
                setIsTransitioning(true)
                setCurrentIndex(poles.length - 1)
            }, 50)
        } else {
            setIsTransitioning(true)
            setCurrentIndex((prev) => prev - 1)
        }
    }

    // Auto-scroll forward only
    useEffect(() => {
        timeoutRef.current = setInterval(next, 5000) // Slightly slower than services
        return () => {
            if (timeoutRef.current) clearInterval(timeoutRef.current)
        }
    }, [currentIndex, poles.length])

    if (!poles || poles.length === 0) return null

    return (
        <div className="relative group">
            <div className="overflow-hidden px-1 py-4">
                <div
                    className={`flex ${isTransitioning ? "transition-transform duration-700 ease-in-out" : ""}`}
                    style={{
                        transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`
                    }}
                >
                    {extendedPoles.map((pole, idx) => (
                        <div
                            key={`${pole.id}-${idx}`}
                            className="w-full shrink-0 px-3 h-full"
                            style={{ width: `${100 / visibleItems}%` }}
                        >
                            <Link href={`/services?pole=${pole.slug}`} className="group/link block h-full">
                                <Card className="h-full transition-all duration-300 hover:shadow-lg flex flex-col border border-border/50 bg-card rounded-xl">
                                    <CardContent className="p-6 flex flex-col flex-grow">
                                        <div className="mb-4">
                                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                                                Pôle d&apos;expertise
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-card-foreground leading-tight mb-3 group-hover/link:text-primary transition-colors">
                                            {pole.name}
                                        </h3>
                                        <p className="text-muted-foreground line-clamp-3 text-sm flex-grow">
                                            {pole.description}
                                        </p>

                                        {/* Divider */}
                                        <div className="h-px bg-border my-5"></div>

                                        {/* Footer area with icon and link */}
                                        <div className="mt-auto flex items-center justify-between">
                                            {/* Circular Icon Area */}
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                                                    <Users className="h-5 w-5 text-slate-500" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-foreground">Services associés</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center text-primary font-medium text-sm group-hover/link:underline underline-offset-4">
                                                Découvrir <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
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
            <div className="flex justify-center gap-2 mt-4">
                {poles.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            setIsTransitioning(true)
                            setCurrentIndex(i)
                        }}
                        className={`h-2 transition-all rounded-full ${(currentIndex % poles.length) === i ? "w-8 bg-primary" : "w-2 bg-slate-300 hover:bg-slate-400"
                            }`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}
