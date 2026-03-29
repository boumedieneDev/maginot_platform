import Link from "next/link"
import Image from "next/image"
import { Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react"
import { createBuildClient } from "@/lib/supabase/server"

export async function Footer() {
    const supabase = createBuildClient()
    const { data: services } = await supabase
        .from('services')
        .select('name, slug')
        .eq('is_active', true)
        .limit(5)

    return (
        <footer className="bg-slate-900 text-slate-200">
            <div className="container mx-auto px-4 py-12">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-white">GROUPE MAGINOT</span>
                        </div>
                        <p className="text-sm text-slate-400 max-w-xs">
                            Votre partenaire de confiance pour des solutions de services professionnels et innovants.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <Link href="https://www.facebook.com//MAGINOT2021" target="_blank" className="hover:text-white transition-colors">
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link href="https://www.youtube.com/@groupemaginot" target="_blank" className="hover:text-white transition-colors">
                                <Youtube className="h-5 w-5" />
                            </Link>
                            <Link href="https://www.tiktok.com/@groupemaginot" target="_blank" className="hover:text-white transition-colors">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-5 w-5"
                                >
                                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                                </svg>
                            </Link>
                            <Link href="https://wa.me/213770998177" target="_blank" className="hover:text-white transition-colors">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-5 w-5"
                                >
                                    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                                    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold text-white">Liens Rapides</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
                            </li>
                            <li>
                                <Link href="/services" className="hover:text-white transition-colors">Nos Services</Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-white transition-colors">À Propos</Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold text-white">Services</h3>
                        <ul className="space-y-2 text-sm">
                            {services && services.length > 0 ? (
                                services.map((service) => (
                                    <li key={service.slug}>
                                        <Link href={`/services/${service.slug}`} className="hover:text-white transition-colors">
                                            {service.name}
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <li>
                                    <span className="text-slate-500">Aucun service disponible</span>
                                </li>
                            )}
                            <li>
                                <Link href="/services" className="hover:text-white transition-colors text-primary underline">Voir tout</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold text-white">Contact</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-primary shrink-0" />
                                <a href="https://maps.app.goo.gl/7deXhhkRqahi83JX6" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                    61 Rue Tahar Bouchedda,<br />
                                    El Harrach, Alger
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-primary shrink-0" />
                                <span>+213 7 70 99 81 77</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-primary shrink-0" />
                                <span>contact@maginot.app</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
                    <p>&copy; {new Date().getFullYear()} Groupe Maginot. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    )
}
