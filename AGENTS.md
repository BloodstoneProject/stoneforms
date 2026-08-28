# Stoneforms — form builder (Byter's own product)

**Status:** LIVE at stoneforms.io. Intended as a Typeform replacement, including
for Byter's own forms.

## Stack & deploy

Next.js **14.2.21** · React **18.3.1** · Tailwind · Supabase · Stripe Connect

⚠️ **This is the oldest stack in the portfolio.** Everything else is Next 16 /
React 19. Patterns that work in the restaurant sites — `proxy.ts`, Next 16 app
conventions — do not apply here. `next.config.js` and `postcss.config.js` are
still CommonJS `.js`, not `.ts`.

Deploy notes live in `DEPLOY.md`; `deploy-marketing.sh` exists as a helper.

## Architecture

- `app/` — marketing (`/`, `/features`, `/pricing`, `/templates`, `/blog`,
  `/help`, `/contact`), plus `/dashboard` and `/onboarding`.
- `app/api/` — `forms`, `forms/[id]`, `forms/from-template`, `contacts`,
  `contacts/[id]`, `deals`, `deals/[id]`, `upload`, `contact`, and
  `payments/{checkout,connect,webhook}`.
- `lib/` is the engine: `blocks.ts`, `field-types.ts`, `form-controls.ts`,
  `form-mapping.ts`, `form-templates.ts`, `endings.ts`, `calc.ts`, `embed.ts`,
  `gamify.ts`, `email-utils.ts`, `file-utils.ts`.
- `database/schema.sql` plus `database/migrations/`.
- Tests in `lib/__tests__/`: `endings`, `logic`, `recall`, `variables`.

It is a form builder **and** a light CRM — contacts and deals are first-class,
not an add-on.

## Traps — read before editing

⚠️ **`createAdminClient()` silently falls back to the anon key.**
`lib/supabase-server.ts` L36:
```
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey
```
If `SUPABASE_SERVICE_ROLE_KEY` is unset, every "admin" client is really an anon
client. Privileged writes then fail against RLS with no error at the call site —
things simply do not save. This is the single most likely cause of "it worked
locally but nothing persists in production". **Check that env var first.**

**The Stripe Connect webhook is dormant by default.**
`app/api/payments/webhook/route.ts` returns 503 unless
`STRIPE_CONNECT_WEBHOOK_SECRET` is set. It is deliberately best-effort and never
throws back to Stripe once a signature is valid, so a transient DB failure
returns 200 and Stripe never retries. A payment can be taken while the
`form_payments` row is never marked paid.

**Nine competing status documents, none authoritative.**
`PROJECT_STATUS.md`, `FINAL_BUILD_COMPLETE.md`, `PHASE_6_COMPLETE.md`,
`PHASE_6_PROGRESS.md`, `COMPLETE_FEATURE_LIST.md`, `FRESH_START_GUIDE.md`,
`QUICKSTART.md`, `LAUNCH_TEMPLATES.md`, `DEPLOY.md`. Their names claim
completion; none is a reliable statement of current state. **Trust the code and
this file, not those.** Loose scripts (`create-pages.js`, `fix-pages.py`,
`fix-all-pages.py`) are one-off migration helpers, not part of the app.

**The byter.com Typeform cutover was deployed and then reverted.** Operational,
not visible in this repo — confirm current state before assuming byter.com's
forms run on Stoneforms.

## Do not

- Do not assume Next 16 patterns apply here.
- Do not trust a `*_COMPLETE.md` file as a statement of what works.
- Do not treat a successful webhook 200 as proof a payment was recorded.

## The core product surfaces (do not mistake this for a marketing site)

The routes that actually serve forms to the public are:

- **`/f/[id]`** — the hosted form
- **`/embed/[id]`** — the embeddable form
- **`/p/[slug]`** — published form by slug

Plus auth at `/auth/login`, `/signup`. The marketing pages are the smaller part
of this app.

`middleware.ts` does **branded subdomain serving** — a request on
`acme.stoneforms.app` is rewritten to the public form page. It is currently
**inert until `*.stoneforms.app` DNS exists**, so the code path is live but
unreachable. It also handles auth gating.

**Unlisted API routes** are extensive: `public/forms/*`,
`forms/[id]/{submit,responses,fields,webhooks,analytics}`, `billing/*`,
`integrations/google/*`, `ai/generate`, `user/plan`.

More `lib/` modules than listed above: `logic.ts`, `recall.ts`, `variables.ts`,
`stripe.ts`, `plan-limits.ts`, `google-sheets.ts`, `webhooks.ts`, `subdomain.ts`.

Other dependencies: **Resend** (email) and the **Anthropic SDK** (AI form
generation, `app/api/ai/generate`).

## Two Stripe webhooks — do not confuse them

- **`app/api/payments/webhook`** — **Stripe Connect**. Money a form's *owner*
  collects from *their* customers. Needs `STRIPE_CONNECT_WEBHOOK_SECRET`.
- **`app/api/billing/webhook`** — **SaaS billing**. Money *Stoneforms* collects
  from its own subscribers.

They have separate secrets and separate failure modes. Fixing one does not fix
the other.

## The tests cannot be run with `npm test`

`lib/__tests__/` contains `endings`, `logic`, `recall` and `variables` tests, but
`package.json` has only `dev`, `build`, `start` and `lint` — **there is no test
script and no runner configured.** The tests exist and are unrunnable as
checked in. Do not claim test coverage here.

Migrations are minimal: `database/schema.sql` plus a single
`database/migrations/google_sheets.sql`. Anything else in the live database has
no migration in this repo.
