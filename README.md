# Phase 1 Website Vitrine - Maginot Platform

A professional website vitrine built with Next.js, Supabase, and shadcn/ui.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **UI Library**: shadcn/ui
- **Backend & Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Language**: TypeScript

## Features

### Public Features
- Home page with hero section and service highlights
- Services listing and detail pages
- About and Contact pages
- Client registration form (lead capture)

### Admin Features
- Protected admin dashboard
- Leads management with filters
- Status tracking (Nouveau, Contacté, En attente)
- Admin notes for internal tracking
- Statistics overview

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd /Users/macbookair/Desktop/maginot_platform
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   
   The `.env.local` file is already configured with your Supabase credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

4. **Set up the database**:
   
   - Go to your Supabase project dashboard
   - Navigate to the SQL Editor
   - Run the SQL script from `database/migration.sql`
   - This will create tables, indexes, and RLS policies

5. **Create an admin user**:
   
   - Go to Supabase Dashboard → Authentication → Users
   - Click "Add user" → "Create new user"
   - Enter email and password for admin access
   - This user will be able to access `/admin`

6. **Run the development server**:
   ```bash
   npm run dev
   ```

7. **Open your browser**:
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
maginot_platform/
├── app/
│   ├── (public)/           # Public pages
│   │   ├── page.tsx        # Home
│   │   ├── services/       # Services pages
│   │   ├── about/          # About page
│   │   ├── contact/        # Contact page
│   │   ├── register/       # Registration form
│   │   └── login/          # Login page
│   ├── admin/              # Admin dashboard
│   │   ├── layout.tsx      # Protected layout
│   │   └── page.tsx        # Dashboard
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── navbar.tsx          # Navigation
│   ├── leads-table.tsx     # Admin leads table
│   └── lead-detail-dialog.tsx
├── lib/
│   ├── supabase/           # Supabase clients
│   ├── utils.ts            # Utilities
│   └── constants.ts        # Constants (wilayas, budgets)
├── types/
│   └── database.ts         # TypeScript types
├── database/
│   └── migration.sql       # Database schema
└── middleware.ts           # Auth middleware
```

## Database Schema

### Services Table
- `id`: UUID (primary key)
- `name`: Service name
- `slug`: URL-friendly identifier
- `description`: Short description
- `details`: Full description
- `is_active`: Boolean
- `created_at`: Timestamp

### Leads Table
- `id`: UUID (primary key)
- `full_name`: Client name
- `email`: Client email
- `phone`: Phone/WhatsApp
- `company_name`: Company name (optional)
- `service_id`: Reference to services
- `wilaya`: Algerian wilaya
- `budget`: Estimated budget
- `message`: Client message
- `status`: Lead status (Nouveau, Contacté, En attente)
- `admin_notes`: Internal admin notes
- `created_at`: Timestamp

## Security

- Row Level Security (RLS) enabled on all tables
- Public users can:
  - Read active services
  - Insert leads
- Authenticated users (admins) can:
  - Manage all services
  - Read and update all leads
- Protected `/admin` routes with middleware

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deployment

The project is ready for deployment to Vercel or any Next.js-compatible hosting platform.

For Vercel:
1. Push your code to a Git repository
2. Connect the repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Future Enhancements (Phase 2+)

This is Phase 1 only. Future phases may include:
- Client portal
- Payment integration
- Advanced CRM features
- Email notifications
- Document management

## Support

For questions or issues, contact: contact@maginot-platform.dz
