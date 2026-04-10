# EventKit

AI-native event management platform. Set up your event in 10 minutes — from registration to check-in.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15, App Router, TypeScript |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Database | PostgreSQL via Supabase, Drizzle ORM |
| Auth | Clerk |
| Payments | Stripe Connect |
| Email | Resend + React Email |
| AI | Anthropic SDK (Claude Sonnet 4) |
| Rich Text | Tiptap |
| File Upload | Uploadthing |
| Validation | Zod |

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL database (Supabase recommended)

### Setup

1. Clone the repository and install dependencies:
```bash
pnpm install
```

2. Copy the environment template and fill in your keys:
```bash
cp .env.example .env.local
```

See [`docs/env-setup.md`](docs/env-setup.md) for detailed instructions on getting each API key.

3. Push the database schema:
```bash
pnpm db:push
```

4. Start the development server:
```bash
pnpm dev
```

Visit `http://localhost:3000` to see the app.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (marketing)/        # Public landing + pricing pages
│   ├── (dashboard)/        # Authenticated organizer dashboard
│   ├── (event)/            # Public event websites + registration
│   ├── (checkin)/          # Tablet check-in app
│   └── api/                # Webhooks + file uploads
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   ├── dashboard/          # Dashboard components (sidebar, cards)
│   ├── marketing/          # Landing page sections
│   ├── email-builder/      # Tiptap email editor + merge tags
│   ├── badge-designer/     # Badge template editor
│   ├── checkin/            # Check-in app components
│   └── registration/       # Registration form components
├── db/
│   ├── schema/             # Drizzle ORM table definitions
│   └── queries/            # Data access layer (one file per domain)
├── lib/
│   ├── validators/         # Zod schemas
│   ├── email/              # Email rendering + merge tags
│   ├── safe-action.ts      # Server action wrapper (auth + validation)
│   ├── stripe.ts           # Stripe SDK (isolated)
│   ├── resend.ts           # Resend SDK (isolated)
│   ├── ai.ts               # Anthropic SDK (isolated)
│   └── utils.ts            # Shared utilities
├── types/                  # TypeScript type definitions
└── hooks/                  # Custom React hooks
```

## Architecture

### Data Access Layer
All database queries go through `src/db/queries/`. Components and server actions never import from `drizzle-orm` directly.

### Server Actions
All mutations use server actions wrapped in `createSafeAction()` from `src/lib/safe-action.ts`, which handles authentication, organization ownership verification, input validation, and error formatting.

### SDK Isolation
External SDKs are isolated to single files:
- Stripe: `src/lib/stripe.ts`
- Resend: `src/lib/resend.ts`
- Anthropic: `src/lib/ai.ts`

### AI Features
All AI features use Claude Sonnet 4 with forced `tool_choice` for structured JSON output:
- Website content generation
- Registration form field suggestions
- Email copy writing
- Badge layout design
- Event description enhancement

## Deployment

### Vercel

1. Push to GitHub
2. Import in Vercel
3. Add all environment variables from `.env.example`
4. Set up the Stripe webhook endpoint: `https://your-domain.com/api/webhooks/stripe`
5. Deploy

### Database

Use Supabase for PostgreSQL. The connection uses the Transaction Pooler (port 6543) with `prepare: false` for compatibility.

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm db:push` | Push schema to database |
| `pnpm db:generate` | Generate migrations |
| `pnpm db:migrate` | Run migrations |
| `pnpm db:studio` | Open Drizzle Studio |

## License

MIT
