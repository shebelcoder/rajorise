# RajoRise — Project Instructions

## Commands

```bash
# Build
npm run build            # prisma generate + next build

# Dev
npm run dev              # start dev server (localhost:3000)

# Lint
npm run lint             # eslint

# Database
npx prisma migrate dev   # create + apply migration
npx prisma generate      # regenerate client
npx prisma studio        # visual DB browser
npm run seed             # seed test accounts
```

## Architecture

- **Next.js 16** App Router + Turbopack + TypeScript
- **Prisma v7** ORM → Neon PostgreSQL (serverless, `@prisma/adapter-neon`)
- **NextAuth v4** — JWT sessions, 3 credential providers (donor/journalist/admin)
- **Stripe** — Checkout Sessions + webhooks for donations
- **Sentry** — Error tracking (client + server + edge)
- **Tailwind CSS v4** — CSS-first config in `globals.css` (NOT tailwind.config.ts)
- **Inline styles** used for critical layout elements (navbar, sidebar) due to Tailwind v4 class generation issues

### Route Groups
- `(admin)/admin/*` — Admin Command Center (separate layout, no public nav)
- `(journalist)/journalist/*` — Journalist Content Studio (separate layout, sidebar)
- `portal/admin-login` + `portal/journalist-login` — Hidden login pages (not in public nav)

### Key Files
- `prisma/schema.prisma` — 13 models, DRAFT→PENDING→APPROVED flow
- `prisma.config.ts` — Prisma v7 config (loads .env.local for DATABASE_URL)
- `src/lib/prisma.ts` — PrismaNeonHttp adapter (HTTP, no WebSocket)
- `src/lib/auth.ts` — 3 credential providers, admin email whitelist, audit logging
- `src/lib/locations.ts` — Somalia regions/districts/villages data
- `src/lib/rate-limit.ts` — In-memory rate limiter
- `src/lib/sanitize.ts` — XSS sanitization
- `src/middleware.ts` — Role-based route protection

## Key Decisions

- **Tailwind v4 inline style workaround**: Critical layout elements (navbar height, sidebar width, main padding) use inline styles because Tailwind v4's CSS-first config doesn't reliably generate utility classes in production builds
- **Prisma v7 no URL in schema**: `datasource db` has no `url` field — connection URL is in `prisma.config.ts` which loads `.env.local`
- **PrismaNeonHttp over PrismaNeon**: HTTP adapter works on Vercel serverless without WebSocket/ws package
- **3 separate NextAuth providers**: Each role (donor/journalist/admin) has its own credential provider to enforce role-based access at the auth level
- **Admin email whitelist**: Even with ADMIN role in DB, email must be in `ADMIN_EMAILS` env var
- **AI Engine dual-mode**: Uses Claude API if `ANTHROPIC_API_KEY` is set, falls back to rule-based analysis from DB data patterns
- **Report status flow**: DRAFT → PENDING → APPROVED/REJECTED → FUNDING → COMPLETED

## Domain Knowledge

- **RajoRise** = "Hope Into Life" (Somali) — humanitarian donation platform for Somalia
- **Gedo** = Pilot region in southern Somalia (7 districts: Baardheere, Luuq, Doolow, etc.)
- **Gu/Deyr** = Somalia's two rainy seasons (Apr-Jun / Oct-Dec)
- **Jilaal/Hagaa** = Dry seasons (Jan-Mar / Jul-Sep)
- **FundPool** = Per-case financial pool with double-entry ledger
- **PoD** = Proof of Delivery (future feature for field agents)

## Workflow

- Run `npm run build` after making a series of code changes to catch TypeScript errors
- Prisma: always `npx prisma generate` after schema changes
- Use `style={{}}` for structurally critical elements (navbar, sidebar, main padding)
- Never hardcode env values — use `process.env.*`
- Zod validation on all API inputs
- Audit log all admin/journalist actions

## Don'ts

- Don't use `tailwind.config.ts` for theme config (Tailwind v4 ignores it)
- Don't put `url` in `datasource db` block (Prisma v7)
- Don't import from `../generated/prisma` (use `@prisma/client`)
- Don't store files in Postgres — use external storage (Cloudinary/S3)
- Don't expose admin/journalist routes in public navigation
- Don't skip Zod validation on API routes
- Don't let AI engine act autonomously — admin approval required
