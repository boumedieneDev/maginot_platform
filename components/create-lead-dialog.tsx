"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { ALGERIAN_WILAYAS, BUDGET_RANGES } from "@/lib/constants"
import { PlusCircle, Loader2 } from "lucide-react"

interface CreateLeadDialogProps {
    services: any[]
    onSuccess: () => void
}

export function CreateLeadDialog({ services, onSuccess }: CreateLeadDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const supabase = createClient()

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        company_name: "",
        service_id: "",
        wilaya: "",
        budget: "",
        message: "",
        status: "Nouveau"
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase
                .from('leads')
                .insert([
                    {
                        ...formData,
                        service_id: formData.service_id === "none" ? null : formData.service_id
                    }
                ])

            if (error) throw error

            toast({
                title: "Succès",
                description: "La nouvelle demande a été enregistrée manuellement.",
            })

            setOpen(false)
            resetForm()
            onSuccess()
        } catch (error: any) {
            toast({
                title: "Erreur",
                description: error.message || "Une erreur est survenue lors de l'enregistrement.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setFormData({
            full_name: "",
            email: "",
            phone: "",
            company_name: "",
            service_id: "",
            wilaya: "",
            budget: "",
            message: "",
            status: "Nouveau"
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 shadow-md">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nouvelle Inscription
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Ajouter une Inscription Manuellement</DialogTitle>
                    <DialogDescription>
                        Remplissez ce formulaire pour enregistrer un nouveau prospect directement dans le système.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="full_name">Nom Complet</Label>
                            <Input
                                id="full_name"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                required
                                placeholder="ex: Ahmed Benali"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                placeholder="ex: ahmed@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Téléphone / WhatsApp</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                required
                                placeholder="ex: 0550 00 00 00"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company">Nom de l&apos;entreprise (Optionnel)</Label>
                            <Input
                                id="company"
                                value={formData.company_name}
                                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                placeholder="ex: Maginot SARL"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="service">Service Intéressé</Label>
                            <Select 
                                value={formData.service_id} 
                                onValueChange={(v) => setFormData({ ...formData, service_id: v })}
                                required
                            >
                                <SelectTrigger id="service">
                                    <SelectValue placeholder="Choisir un service" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Aucun service spécifique</SelectItem>
                                    {services.map((service) => (
                                        <SelectItem key={service.id} value={service.id}>
                                            {service.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="wilaya">Wilaya</Label>
                            <Select 
                                value={formData.wilaya} 
                                onValueChange={(v) => setFormData({ ...formData, wilaya: v })}
                                required
                            >
                                <SelectTrigger id="wilaya">
                                    <SelectValue placeholder="Choisir une wilaya" />
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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="budget">Estimation du Budget</Label>
                            <Select 
                                value={formData.budget} 
                                onValueChange={(v) => setFormData({ ...formData, budget: v })}
                            >
                                <SelectTrigger id="budget">
                                    <SelectValue placeholder="Choisir une tranche" />
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
                        <div className="space-y-2">
                            <Label htmlFor="status">Statut Initial</Label>
                            <Select 
                                value={formData.status} 
                                onValueChange={(v) => setFormData({ ...formData, status: v })}
                            >
                                <SelectTrigger id="status">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Nouveau">Nouveau</SelectItem>
                                    <SelectItem value="Contacté">Contacté</SelectItem>
                                    <SelectItem value="En attente">En attente</SelectItem>
                                    <SelectItem value="Qualifié">Qualifié</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Message ou Notes (Optionnel)</Label>
                        <Textarea
                            id="message"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Détails supplémentaires sur la demande..."
                            rows={3}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Enregistrement...
                                </>
                            ) : (
                                "Enregistrer le prospect"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
