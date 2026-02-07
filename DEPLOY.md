# Zalci Audio - Deployment Guide

## 1. Environment Variables

Ensure these environment variables are set in your Vercel project settings:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## 2. Supabase Configuration

### Authentication
- In Supabase Dashboard -> Authentication -> URL Configuration:
    - Set `Site URL` to your Vercel domain (e.g., `https://zalci-audio.vercel.app`)
    - Add `https://zalci-audio.vercel.app/auth/callback` to **Redirect URLs**.

### Storage
- Ensure `songs` bucket is **Public**.
- Run `storage_setup.sql` if you haven't already.

## 3. Deploy to Vercel

1.  Push your code to GitHub.
2.  Import the repository in Vercel.
3.  Configure Build Settings:
    -   Framework Preset: Next.js
    -   Build Command: `next build`
    -   Install Command: `npm install`
4.  Add the Environment Variables listed above.
5.  Click **Deploy**.
