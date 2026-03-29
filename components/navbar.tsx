"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

import { Database } from "@/types/database"

type Pole = Database['public']['Tables']['poles']['Row']

const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/about", label: "À propos" },
    { href: "/contact", label: "Contact" },
]

export function Navbar() {
    const pathname = usePathname()
    const router = useRouter()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [poles, setPoles] = useState<Pole[]>([])

    const supabase = createClient()

    // Check if user is logged in
    useEffect(() => {
        supabase.auth.getUser()
            .then(({ data }) => {
                setUser(data.user)
            })
            .catch(() => {
                setUser(null)
            })

        // Fetch Poles for the dropdown
        supabase
            .from('poles')
            .select('*')
            .order('display_order', { ascending: true })
            .then(({ data }) => {
                if (data) setPoles(data)
            })
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push("/")
        router.refresh()
    }

    return (
        <nav className="border-b bg-background sticky top-0 z-50 backdrop-blur-sm bg-white/95">
            <div className="container mx-auto px-4">
                <div className="flex h-20 items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/images/Asset 4.svg"
                            alt="Maginot Platform"
                            width={140}
                            height={50}
                            className="h-12 w-auto"
                            priority
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center gap-6 md:flex">
                        <Link
                            href="/"
                            className={`text-sm font-medium transition-colors hover:text-primary ${pathname === "/" ? "text-primary" : "text-muted-foreground"}`}
                        >
                            Accueil
                        </Link>

                        <div
                            className="relative group"
                            onMouseEnter={() => setServicesDropdownOpen(true)}
                            onMouseLeave={() => setServicesDropdownOpen(false)}
                        >
                            <Link
                                href="/services"
                                className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 ${pathname.startsWith("/services") || pathname.startsWith("/pole") ? "text-primary" : "text-muted-foreground"}`}
                            >
                                Services
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-0.5 opacity-50">
                                    <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>

                            {/* Dropdown Menu */}
                            {servicesDropdownOpen && (
                                <div className="absolute top-full left-0 pt-2 w-56">
                                    <div className="bg-white rounded-md shadow-lg border p-2 flex flex-col gap-1">
                                        <Link
                                            href="/services"
                                            className="px-3 py-2 text-sm font-medium rounded-sm hover:bg-muted text-foreground transition-colors"
                                            onClick={() => setServicesDropdownOpen(false)}
                                        >
                                            Tous les services
                                        </Link>
                                        {poles.length > 0 && <div className="h-px bg-border my-1 mx-2" />}
                                        {poles.map(pole => (
                                            <Link
                                                key={pole.id}
                                                href={`/services?pole=${pole.slug}`}
                                                className="px-3 py-2 text-sm font-medium rounded-sm hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                                onClick={() => setServicesDropdownOpen(false)}
                                            >
                                                Pôle {pole.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {navLinks.slice(1).map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium transition-colors hover:text-primary ${pathname === link.href
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden items-center gap-4 md:flex">
                        {user ? (
                            <Button variant="outline" onClick={handleLogout}>
                                Déconnexion
                            </Button>
                        ) : (
                            <>
                                <Button asChild>
                                    <Link href="/register">S&apos;inscrire</Link>
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="border-t py-4 md:hidden">
                        <div className="flex flex-col gap-4">
                            <Link
                                href="/"
                                className={`text-sm font-medium transition-colors hover:text-primary ${pathname === "/" ? "text-primary" : "text-muted-foreground"}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Accueil
                            </Link>

                            <div className="flex flex-col space-y-2">
                                <Link
                                    href="/services"
                                    className={`text-sm font-medium transition-colors hover:text-primary ${pathname.startsWith("/services") ? "text-primary" : "text-muted-foreground"}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Services
                                </Link>
                                <div className="pl-4 border-l-2 ml-2 flex flex-col space-y-2 pt-1">
                                    <Link
                                        href="/services"
                                        className="text-sm text-muted-foreground hover:text-primary"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Tous les services
                                    </Link>
                                    {poles.map(pole => (
                                        <Link
                                            key={pole.id}
                                            href={`/services?pole=${pole.slug}`}
                                            className="text-sm text-muted-foreground hover:text-primary"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Pôle {pole.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {navLinks.slice(1).map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`text-sm font-medium transition-colors hover:text-primary ${pathname === link.href
                                        ? "text-primary"
                                        : "text-muted-foreground"
                                        }`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="flex flex-col gap-2 pt-2">
                                {user ? (
                                    <Button variant="outline" onClick={() => {
                                        handleLogout()
                                        setMobileMenuOpen(false)
                                    }}>
                                        Déconnexion
                                    </Button>
                                ) : (
                                    <>
                                        <Button asChild>
                                            <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                                                S&apos;inscrire
                                            </Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
