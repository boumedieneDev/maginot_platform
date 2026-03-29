"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

export default function LoginPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            })

            if (error) throw error

            toast({
                title: "Connexion réussie !",
                description: "Redirection vers le dashboard...",
            })

            router.push("/admin")
            router.refresh()
        } catch (error: any) {
            toast({
                title: "Erreur de connexion",
                description: error.message || "Email ou mot de passe incorrect.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mx-auto max-w-md">
                <div className="mb-8 text-center">
                    <h1 className="mb-4 text-4xl font-bold">Connexion</h1>
                    <p className="text-lg text-muted-foreground">
                        Accédez à votre espace administrateur
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Connexion Admin</CardTitle>
                        <CardDescription>
                            Entrez vos identifiants pour accéder au dashboard
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    placeholder="admin@example.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Mot de passe</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    placeholder="••••••••"
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Connexion..." : "Se connecter"}
                            </Button>
                        </form>

                        <div className="mt-4 text-center text-sm text-muted-foreground">
                            <Link href="/" className="hover:text-primary">
                                ← Retour à l&apos;accueil
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
