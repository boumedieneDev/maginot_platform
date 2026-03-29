# Maginot Platform - Setup Guide

## Quick Start

Follow these steps to get your project running:

### 1. Database Setup

1. Log in to your Supabase dashboard at https://supabase.com
2. Navigate to your project: https://fidohdbtgwezcacbyzaw.supabase.co
3. Go to **SQL Editor** (left sidebar)
4. Create a new query
5. Copy and paste the entire contents of `database/migration.sql`
6. Click **Run** to execute the script
7. Verify that tables `services` and `leads` were created

### 2. Create Admin User

1. In Supabase dashboard, go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Fill in:
   - **Email**: your-admin@email.com
   - **Password**: (create a secure password)
   - Leave **Auto Confirm User** checked
4. Click **Create user**
5. Save these credentials - you'll use them to log into `/admin`

### 3. Install Dependencies

```bash
cd /Users/macbookair/Desktop/maginot_platform
npm install
```

Note: If you encounter network issues, you may need to:
- Check your internet connection
- Try using a VPN
- Or use `npm install --registry=https://registry.npmjs.org/`

### 4. Run the Development Server

```bash
npm run dev
```

The application will start at http://localhost:3000

### 5. Test the Application

1. **Public Pages**:
   - Visit http://localhost:3000 (home page)
   - Navigate to Services, About, Contact
   - Try the registration form at `/register`

2. **Admin Dashboard**:
   - Go to http://localhost:3000/login
   - Log in with the admin credentials you created
   - You'll be redirected to `/admin`
   - View the dashboard, manage leads

## What's Included

✅ Complete public website with:
- Landing page with hero and service highlights
- Services listing and detail pages
- About and contact pages
- Registration form with wilaya selection

✅ Admin dashboard with:
- Statistics cards
- Leads table with filtering
- Lead detail view with status updates
- Admin notes functionality

✅ Database with:
- Services table (with 3 sample services)
- Leads table
- Row Level Security enabled

✅ Authentication:
- Supabase Auth integration
- Protected admin routes
- Login/logout functionality

## Troubleshooting

### Network/NPM Issues
If `npm install` fails due to network issues:
1. Check your internet connection
2. Try: `npm cache clean --force`
3. Then: `npm install`

### Database Issues
If tables don't appear:
1. Check SQL Editor for errors
2. Ensure you ran the entire migration script
3. Verify RLS policies are created

### Authentication Issues
If you can't log in:
1. Verify admin user was created in Supabase Auth
2. Check that email and password are correct
3. Ensure `.env.local` has correct Supabase credentials

### Build Errors
If you see TypeScript or module errors:
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Clear Next.js cache: `rm -rf .next`

## Next Steps

1. **Customize Content**:
   - Edit services in Supabase dashboard
   - Update contact information in About/Contact pages
   - Customize the home page hero text

2. **Test Lead Submission**:
   - Fill out the registration form
   - Check that it appears in the admin dashboard
   - Test status updates and admin notes

3. **Deploy**:
   - Push code to GitHub/GitLab
   - Deploy to Vercel
   - Add environment variables in hosting dashboard

## Important Files

- `database/migration.sql` - Database schema and setup
- `.env.local` - Environment variables (already configured)
- `README.md` - Full project documentation
- `app/admin/page.tsx` - Admin dashboard
- `app/register/page.tsx` - Registration form

## Support

If you need help:
1. Check the main README.md for detailed documentation
2. Review the implementation_plan.md in the brain folder
3. Contact support at contact@maginot-platform.dz
