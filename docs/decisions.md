# Architectural Decisions

This document records the key architectural decisions made during EventKit's development.

## 1. postgres.js over @supabase/supabase-js

**Decision:** Use the `postgres` npm package as the database driver instead of the Supabase JavaScript client.

**Rationale:** Drizzle ORM requires a wire-protocol (TCP) database driver to generate and execute SQL directly. The Supabase JS client uses the PostgREST HTTP API, which does not support raw SQL or Drizzle's query builder. `postgres.js` provides a lightweight, performant PostgreSQL driver over the wire protocol, fully compatible with Drizzle ORM.

## 2. Drizzle snake_case casing

**Decision:** Configure Drizzle with `casing: "snake_case"` so that TypeScript uses camelCase property names while PostgreSQL columns use snake_case.

**Rationale:** This follows conventions on both sides: JavaScript/TypeScript developers expect camelCase, while PostgreSQL convention is snake_case. Drizzle's `casing` option handles the mapping automatically without manual column name overrides, reducing boilerplate and preventing naming inconsistencies.

## 3. UUIDs for all primary keys

**Decision:** Use UUIDs (v4) as primary keys for all database tables instead of auto-incrementing integers.

**Rationale:** UUIDs prevent ID enumeration attacks where an attacker could guess valid resource IDs by incrementing integers. They also simplify distributed systems (no coordination needed for ID generation) and make URLs non-guessable by default. The slight storage overhead is acceptable for the security and architectural benefits.

## 4. Separate validators from DB schema

**Decision:** Define Zod validation schemas separately from Drizzle table definitions, rather than deriving them from Drizzle schemas.

**Rationale:** Validation schemas need to be importable on both client and server. Drizzle schemas import the database driver, which is server-only. By keeping validators separate, we can use them in React Hook Form on the client, in Server Actions on the server, and in API routes, without pulling in database dependencies on the client bundle.

## 5. Public events at /(event)/[slug]

**Decision:** Serve public event pages under a `(event)` route group with a `[slug]` dynamic segment.

**Rationale:** Using a route group `(event)` avoids URL path conflicts with other top-level routes like `/dashboard` or `/pricing`. The event slug appears directly in the URL (e.g., `/techconf-2026`) for clean, shareable links. The route group provides layout isolation without adding a path prefix.

## 6. Stripe Account Links not OAuth

**Decision:** Use Stripe Account Links (hosted onboarding) for Stripe Connect instead of OAuth-based Connect.

**Rationale:** Stripe's current recommendation is Account Links for Connect onboarding. Account Links provide a hosted, Stripe-maintained onboarding flow that handles identity verification, bank account setup, and compliance requirements. This reduces our liability, maintenance burden, and keeps us aligned with Stripe's evolving compliance requirements.

## 7. Clerk publicMetadata for org check

**Decision:** Store the organization ID in Clerk user `publicMetadata` and check it in middleware, rather than querying the database.

**Rationale:** Edge middleware cannot make database calls (no TCP connections in Edge runtime). By storing the org ID in Clerk's `publicMetadata`, we can check whether a user has completed onboarding directly in the middleware JWT without a database roundtrip. This enables fast redirects (e.g., unonboarded users to `/onboarding`) at the edge.

## 8. html5-qrcode for scanner

**Decision:** Use the `html5-qrcode` library for QR code scanning on the check-in page.

**Rationale:** `html5-qrcode` is actively maintained, has good cross-browser camera support (including mobile Safari), and handles camera permissions gracefully. It provides both continuous scanning and file-based scanning modes. Alternatives like `jsQR` require manual camera stream management, while `html5-qrcode` abstracts this complexity.

## 9. Polling not WebSocket for check-in

**Decision:** Use HTTP polling (5-second intervals) for real-time check-in status updates instead of WebSockets.

**Rationale:** WebSocket connections are more complex to manage on serverless platforms like Vercel, requiring external infrastructure (e.g., Pusher, Ably). For check-in dashboards, a 5-second polling interval provides adequately fresh data. The simplicity of polling (standard HTTP requests, no connection management, works through proxies) outweighs the marginal latency benefit of WebSockets for this use case.

## 10. Forced tool_choice for AI

**Decision:** Use `tool_choice: { type: "tool", name: "..." }` when calling the Anthropic API to force the model to return structured output via a specific tool.

**Rationale:** When we need structured JSON output (e.g., website configuration, email content), forcing `tool_choice` guarantees the model responds with a tool call containing valid JSON matching our schema. Without forced tool choice, the model might respond with plain text or choose a different tool, requiring additional parsing and error handling.

## 11. In-memory rate limiter

**Decision:** Implement rate limiting using an in-memory Map with sliding window counters, rather than Redis-based rate limiting.

**Rationale:** EventKit runs on a single Vercel serverless instance during its initial phase. An in-memory rate limiter is sufficient for this deployment model, avoids the cost and complexity of provisioning Redis, and has zero network latency. When scaling to multiple instances, this can be replaced with a Redis-backed solution (e.g., Upstash) with the same interface.

## 12. Tiptap custom Node for merge tags

**Decision:** Implement email merge tags (e.g., `{{firstName}}`, `{{eventName}}`) as custom Tiptap Nodes rather than using a suggestion/autocomplete popup.

**Rationale:** Merge tags are a fixed, known set (not user-generated content), so a suggestion popup adds unnecessary UX complexity. Custom Nodes render merge tags as styled inline chips in the editor, making them visually distinct from regular text. They are inserted via toolbar buttons or a dropdown, which is more discoverable and less error-prone than typing trigger characters.
