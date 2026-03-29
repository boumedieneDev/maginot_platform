export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            poles: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    description: string | null
                    image: string | null
                    display_order: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    description?: string | null
                    image?: string | null
                    display_order?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    description?: string | null
                    image?: string | null
                    display_order?: number | null
                    created_at?: string
                }
            }
            services: {
                Row: {
                    id: string
                    pole_id: string | null
                    name: string
                    slug: string
                    description: string
                    details: string | null
                    image_url: string | null
                    additional_details: Json | null
                    is_active: boolean
                    display_order: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    pole_id?: string | null
                    name: string
                    slug: string
                    description: string
                    details?: string | null
                    image_url?: string | null
                    additional_details?: Json | null
                    is_active?: boolean
                    display_order?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    pole_id?: string | null
                    name?: string
                    slug?: string
                    description?: string
                    details?: string | null
                    image_url?: string | null
                    additional_details?: Json | null
                    is_active?: boolean
                    display_order?: number | null
                    created_at?: string
                }
            }
            offres: {
                Row: {
                    id: string
                    service_id: string
                    title: string
                    price: number | null
                    currency: string | null
                    badge: string | null
                    status: 'Active' | 'Inactive' | null
                    display_order: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    service_id: string
                    title: string
                    price?: number | null
                    currency?: string | null
                    badge?: string | null
                    status?: 'Active' | 'Inactive' | null
                    display_order?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    service_id?: string
                    title?: string
                    price?: number | null
                    currency?: string | null
                    badge?: string | null
                    status?: 'Active' | 'Inactive' | null
                    display_order?: number | null
                    created_at?: string
                }
            }
            offre_features: {
                Row: {
                    id: string
                    offre_id: string
                    feature_text: string
                    display_order: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    offre_id: string
                    feature_text: string
                    display_order?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    offre_id?: string
                    feature_text?: string
                    display_order?: number | null
                    created_at?: string
                }
            }
            leads: {
                Row: {
                    id: string
                    full_name: string
                    email: string
                    phone: string
                    company_name: string | null
                    service_id: string | null
                    wilaya: string
                    budget: string | null
                    message: string | null
                    wants_consultation: boolean
                    offre_id: string | null
                    status: 'Nouveau' | 'Contacté' | 'En attente' | 'Qualifié'
                    admin_notes: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    full_name: string
                    email: string
                    phone: string
                    company_name?: string | null
                    service_id?: string | null
                    wilaya: string
                    budget?: string | null
                    message?: string | null
                    wants_consultation?: boolean
                    offre_id?: string | null
                    status?: 'Nouveau' | 'Contacté' | 'En attente' | 'Qualifié'
                    admin_notes?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    full_name?: string
                    email?: string
                    phone?: string
                    company_name?: string | null
                    service_id?: string | null
                    wilaya?: string
                    budget?: string | null
                    message?: string | null
                    wants_consultation?: boolean
                    offre_id?: string | null
                    status?: 'Nouveau' | 'Contacté' | 'En attente' | 'Qualifié'
                    admin_notes?: string | null
                    created_at?: string
                }
            }
            email_templates: {
                Row: {
                    id: string
                    name: string
                    service_id: string | null
                    subject: string
                    html_body: string
                    from_name: string
                    from_email: string
                    status: 'Active' | 'Inactive'
                    is_global_default: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    service_id?: string | null
                    subject: string
                    html_body: string
                    from_name?: string
                    from_email?: string
                    status?: 'Active' | 'Inactive'
                    is_global_default?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    service_id?: string | null
                    subject?: string
                    html_body?: string
                    from_name?: string
                    from_email?: string
                    status?: 'Active' | 'Inactive'
                    is_global_default?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            email_queue: {
                Row: {
                    id: string
                    queue_type: 'trigger' | 'campaign' | 'test'
                    to_email: string
                    subject: string
                    html: string
                    from_name: string
                    from_email: string
                    status: 'pending' | 'sent' | 'failed'
                    attempts: number
                    last_error: string | null
                    payload: Json | null
                    created_at: string
                    sent_at: string | null
                    opened_at: string | null
                    open_count: number
                    updated_at: string
                }
                Insert: {
                    id?: string
                    queue_type?: 'trigger' | 'campaign' | 'test'
                    to_email: string
                    subject: string
                    html: string
                    from_name?: string
                    from_email?: string
                    status?: 'pending' | 'sent' | 'failed'
                    attempts?: number
                    last_error?: string | null
                    payload?: Json | null
                    created_at?: string
                    sent_at?: string | null
                    opened_at?: string | null
                    open_count?: number
                    updated_at?: string
                }
                Update: {
                    id?: string
                    queue_type?: 'trigger' | 'campaign' | 'test'
                    to_email?: string
                    subject?: string
                    html?: string
                    from_name?: string
                    from_email?: string
                    status?: 'pending' | 'sent' | 'failed'
                    attempts?: number
                    last_error?: string | null
                    payload?: Json | null
                    created_at?: string
                    sent_at?: string | null
                    opened_at?: string | null
                    open_count?: number
                    updated_at?: string
                }
            }
        }
    }
}
