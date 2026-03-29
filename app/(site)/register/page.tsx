"use client"

import { Suspense, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { ALGERIAN_WILAYAS, BUDGET_RANGES } from "@/lib/constants"
import type { Database } from "@/types/database"

type Service = Database['public']['Tables']['services']['Row']
type Offre = Database['public']['Tables']['offres']['Row']

function RegisterForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { toast } = useToast()
    const [services, setServices] = useState<Service[]>([])
    const [offres, setOffres] = useState<Offre[]>([])
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        company_name: "",
        service_id: "",
        offre_id: "",
        wilaya: "",
        budget: "",
        message: "",
        wants_consultation: false,
    })

    const supabase = createClient()

    useEffect(() => {
        // Load services
        async function loadServices() {
            const { data } = await supabase
                .from('services')
                .select('*')
                .eq('is_active', true)

            if (data) {
                setServices(data)

                // Pre-select service from query param
                const serviceSlug = searchParams.get('service')
                const wantsConsult = searchParams.get('consultation') === 'true'

                if (serviceSlug) {
                    const service = data.find(s => s.slug === serviceSlug)
                    if (service) {
                        setFormData(prev => ({
                            ...prev,
                            service_id: service.id,
                            wants_consultation: wantsConsult || prev.wants_consultation
                        }))
                        // the next useEffect will load offres because service_id changed
                    }
                } else if (wantsConsult) {
                    setFormData(prev => ({ ...prev, wants_consultation: true }))
                }
            }
        }
        loadServices()
    }, [searchParams])

    useEffect(() => {
        // Load offres when a service is selected
        async function loadOffres() {
            if (!formData.service_id) {
                setOffres([])
                return
            }
            const { data } = await supabase
                .from('offres')
                .select('*')
                .eq('service_id', formData.service_id)
                .eq('status', 'Active')

            if (data) {
                setOffres(data)

                // Pre-select offre from query param if it matches the current service
                const offreId = searchParams.get('offre')
                if (offreId && data.some(o => o.id === offreId)) {
                    setFormData(prev => ({ ...prev, offre_id: offreId }))
                }
            }
        }
        loadOffres()
    }, [formData.service_id, searchParams])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const leadPayload = {
            full_name: formData.full_name,
            email: formData.email,
            phone: formData.phone,
            company_name: formData.company_name || null,
            service_id: formData.service_id === "none" ? null : (formData.service_id || null),
            offre_id: formData.offre_id === "none" ? null : (formData.offre_id || null),
            wilaya: formData.wilaya,
            budget: formData.budget || null,
            message: formData.message || null,
            wants_consultation: formData.wants_consultation,
            status: 'Nouveau',
        }

        try {
            const { error } = await supabase
                .from('leads')
                .insert([leadPayload])

            if (error) throw error

            toast({
                title: "Inscription réussie !",
                description: "Votre demande a été enregistrée et l'e-mail a été mis en file d'envoi.",
            })

            // Reset form
            setFormData({
                full_name: "",
                email: "",
                phone: "",
                company_name: "",
                service_id: "",
                offre_id: "",
                wilaya: "",
                budget: "",
                message: "",
                wants_consultation: false,
            })

            // Redirect to home after 2 seconds
            setTimeout(() => {
                router.push("/")
            }, 2000)
        } catch (error: any) {
            toast({
                title: "Erreur",
                description: error.message || "Une erreur est survenue. Veuillez réessayer.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mx-auto max-w-2xl">
                <div className="mb-8 text-center">
                    <h1 className="mb-4 text-4xl font-bold">Inscription</h1>
                    <p className="text-lg text-muted-foreground">
                        Remplissez le formulaire pour demander un service
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Formulaire d&apos;Inscription</CardTitle>
                        <CardDescription>
                            Les champs marqués d&apos;un astérisque (*) sont obligatoires
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <Label htmlFor="full_name">Nom Complet *</Label>
                                <Input
                                    id="full_name"
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    required
                                    placeholder="Votre nom complet"
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    placeholder="votre@email.com"
                                />
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <Label htmlFor="phone">Téléphone / WhatsApp *</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                    placeholder="+213 XXX XX XX XX"
                                />
                            </div>

                            {/* Company Name */}
                            <div className="space-y-2">
                                <Label htmlFor="company_name">Nom de l&apos;Entreprise</Label>
                                <Input
                                    id="company_name"
                                    value={formData.company_name}
                                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                    placeholder="Nom de votre entreprise (optionnel)"
                                />
                            </div>

                            {/* Service Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="service">Service Souhaité</Label>
                                <Select
                                    value={formData.service_id}
                                    onValueChange={(value) => setFormData({ ...formData, service_id: value, offre_id: "" })}
                                >
                                    <SelectTrigger id="service">
                                        <SelectValue placeholder="Sélectionnez un service" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Aucun service</SelectItem>
                                        {services.map((service) => (
                                            <SelectItem key={service.id} value={service.id}>
                                                {service.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Offre Selection (Conditionally rendered) */}
                            {formData.service_id && formData.service_id !== "none" && offres.length > 0 && (
                                <div className="space-y-2">
                                    <Label htmlFor="offre">Formule / Offre (Optionnel)</Label>
                                    <Select
                                        value={formData.offre_id}
                                        onValueChange={(value) => setFormData({ ...formData, offre_id: value === "none" ? "" : value })}
                                    >
                                        <SelectTrigger id="offre">
                                            <SelectValue placeholder="Choisir une formule (non obligatoire)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Aucune formule spécifique</SelectItem>
                                            {offres.map((offre) => (
                                                <SelectItem key={offre.id} value={offre.id}>
                                                    {offre.title} {offre.price ? `(${offre.price} ${offre.currency})` : ""}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {/* Wilaya */}
                            <div className="space-y-2">
                                <Label htmlFor="wilaya">Wilaya *</Label>
                                <Select
                                    value={formData.wilaya}
                                    onValueChange={(value) => setFormData({ ...formData, wilaya: value })}
                                    required
                                >
                                    <SelectTrigger id="wilaya">
                                        <SelectValue placeholder="Sélectionnez votre wilaya" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ALGERIAN_WILAYAS.map((wilaya) => (
                                            <SelectItem key={wilaya.value} value={wilaya.label}>
                                                {wilaya.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Budget */}
                            <div className="space-y-2">
                                <Label htmlFor="budget">Budget Estimé</Label>
                                <Select
                                    value={formData.budget}
                                    onValueChange={(value) => setFormData({ ...formData, budget: value })}
                                >
                                    <SelectTrigger id="budget">
                                        <SelectValue placeholder="Sélectionnez une fourchette" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {BUDGET_RANGES.map((range) => (
                                            <SelectItem key={range.value} value={range.label}>
                                                {range.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Message */}
                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea
                                    id="message"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    placeholder="Décrivez votre besoin en détail"
                                    rows={4}
                                />
                            </div>

                            {/* Consultation Checkbox */}
                            <div className="flex items-center space-x-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="consultation"
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    checked={formData.wants_consultation}
                                    onChange={(e) => setFormData({ ...formData, wants_consultation: e.target.checked })}
                                />
                                <Label htmlFor="consultation" className="text-sm cursor-pointer">
                                    Je souhaite bénéficier d'une consultation d'expert pour évaluer les besoins de mon projet (Recommandé)
                                </Label>
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Envoi en cours..." : "Envoyer la demande"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div className="container mx-auto px-4 py-12 text-center">Chargement du formulaire...</div>}>
            <RegisterForm />
        </Suspense>
    )
}
