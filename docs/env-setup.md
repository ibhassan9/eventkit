# Environment Setup Guide

This guide walks through setting up all external services required to run EventKit locally.

## Prerequisites

- Node.js 20+
- pnpm 9+
- A modern browser (Chrome, Firefox, Safari, Edge)

## 1. Clerk (Authentication)

1. Go to [clerk.com](https://clerk.com) and create an account.
2. Create a new application. Select "Email" and "Google" as sign-in methods.
3. Go to **API Keys** in the Clerk dashboard.
4. Copy the following values to your `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

5. Set the sign-in and sign-up redirect URLs:

```env
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

6. In Clerk dashboard, go to **Paths** and ensure the sign-in/sign-up URLs match.

## 2. Supabase (Database)

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Choose a region close to your users (e.g., `ca-central-1` for Canada).
3. Set a strong database password and save it securely.
4. Once the project is created, go to **Settings > Database**.
5. Copy the **Connection string** (URI format) under "Connection pooling" (Transaction mode).
6. Enable **pgBouncer** for connection pooling (recommended for serverless).
7. Add to `.env.local`:

```env
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
```

8. Run database migrations:

```bash
pnpm db:push
```

## 3. Stripe (Payments)

1. Go to [stripe.com](https://stripe.com) and create an account.
2. Make sure you are in **Test mode** (toggle in the dashboard header).
3. Go to **Developers > API Keys** and copy the keys:

```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

4. Set up a webhook endpoint:
   - Go to **Developers > Webhooks**.
   - Click "Add endpoint".
   - Set the URL to `https://your-domain.com/api/webhooks/stripe` (use ngrok for local development).
   - Select events: `checkout.session.completed`, `account.updated`, `payment_intent.succeeded`, `payment_intent.payment_failed`.
   - Copy the webhook signing secret:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

5. Enable Stripe Connect:
   - Go to **Connect > Settings**.
   - Configure your platform profile.
   - Set the Connect onboarding redirect URL to `https://your-domain.com/settings`.

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 4. Resend (Email)

1. Go to [resend.com](https://resend.com) and create an account.
2. Add and verify your sending domain (go to **Domains > Add Domain** and add the DNS records).
3. Go to **API Keys** and create a new key:

```env
RESEND_API_KEY=re_...
```

4. Set the from address:

```env
RESEND_FROM_EMAIL=events@yourdomain.com
```

Note: During development, you can send to your own email without verifying a domain.

## 5. Anthropic (AI)

1. Go to [console.anthropic.com](https://console.anthropic.com) and create an account.
2. Go to **API Keys** and generate a new key:

```env
ANTHROPIC_API_KEY=sk-ant-...
```

3. Ensure your account has billing set up (the API requires a funded account).

## 6. Uploadthing (File Uploads)

1. Go to [uploadthing.com](https://uploadthing.com) and create an account.
2. Create a new app in the dashboard.
3. Go to **API Keys** and copy the token:

```env
UPLOADTHING_TOKEN=...
```

## Complete .env.local Template

Create a `.env.local` file in the project root with all values:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Supabase / Database
DATABASE_URL=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# Anthropic
ANTHROPIC_API_KEY=

# Uploadthing
UPLOADTHING_TOKEN=
```

## Running the Project

```bash
# Install dependencies
pnpm install

# Push database schema
pnpm db:push

# Start development server
pnpm dev
```

The application will be available at `http://localhost:3000`.
