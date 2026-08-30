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

⚠️ **`createAdminClient()` falls back to the anon key.** The fallback is still
there (`lib/supabase-server.ts`, `createAdminClient`) but it is no longer silent:
since commit `8da6668` it logs a `console.error` once in production. The
`|| supabaseAnonKey` one-liner an earlier version of this file quoted is gone.

If `SUPABASE_SERVICE_ROLE_KEY` is unset, every "admin" client is really an anon
client. Privileged writes then fail against RLS with no error at the call site —
things simply do not save. **`SUPABASE_SERVICE_ROLE_KEY` is now set in
Production** (added 28 Aug 2026, confirmed via `vercel env ls` on 30 Aug), so
this is no longer the live cause of "nothing persists". It still is in Preview
and Development, where the variable does not exist.

**The Stripe Connect webhook is dormant by default.**
`app/api/payments/webhook/route.ts` returns 503 unless
`STRIPE_CONNECT_WEBHOOK_SECRET` is set. It is deliberately best-effort and never
throws back to Stripe once a signature is valid, so a transient DB failure
returns 200 and Stripe never retries. A payment can be taken while the
`form_payments` row is never marked paid.

## Environment variables — verified 30 Aug 2026

`vercel env ls` on `bloodstoneprojects/stoneforms`. **The code references 21
env vars. Seven exist.** This is the shortest path to understanding why a
feature "does nothing" here.

| Set | Environments |
|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Production only (added 28 Aug 2026) |
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | Production, Preview, Development |
| `NEXT_PUBLIC_SITE_URL` | Production only |
| `RESEND_API_KEY` | Production, Preview, Development |
| `EMAIL_FROM` | Production only |

**Missing, and what each one switches off:**

| Missing | Consequence |
|---|---|
| `STRIPE_SECRET_KEY` | `getStripe()` returns `null`. **All** Stripe is off — SaaS billing and Connect both |
| `STRIPE_WEBHOOK_SECRET` | SaaS billing webhook cannot verify anything |
| `STRIPE_PRICE_PRO`, `STRIPE_PRICE_BUSINESS` | No plan maps to a price; `planForPriceId` always returns null |
| `STRIPE_CONNECT_ENABLED` | Connect is off by default and stays off |
| `STRIPE_CONNECT_WEBHOOK_SECRET` | Connect webhook returns 503 |
| `ANTHROPIC_API_KEY` | `/api/ai/generate` — AI form generation |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google Sheets integration |
| `RECAPTCHA_SECRET_KEY` | Submission spam protection |
| `CONTACT_TO` | Contact-form recipient |
| `NEXT_PUBLIC_ROOT_DOMAIN` | Branded subdomains (already inert — no `*.stoneforms.app` DNS) |

### The "payment taken but never recorded" risk is latent, not live

Earlier notes framed this as an active exposure. It is not, **yet**, and the
reason matters:

- `lib/stripe-connect.ts` gates on `STRIPE_SECRET_KEY && STRIPE_CONNECT_ENABLED === 'true'`.
  Neither is set, so `createCheckoutForSubmission` returns
  `{ ok: false, reason: 'connect_not_configured' }` and `/api/payments/checkout`
  answers `{ ok: false }`. **No Connect payment can be started at all.**
- `/api/billing/checkout` returns 503 for the same reason.

The risk becomes real **the moment `STRIPE_SECRET_KEY` and
`STRIPE_CONNECT_ENABLED=true` are set without `STRIPE_CONNECT_WEBHOOK_SECRET`**:
checkout would then work, a customer would pay, and the webhook that marks
`form_payments` paid would return 503 forever. **Set the webhook secret in the
same change that enables Connect, never after it.**

### Runbook — rotating the Supabase service-role key

The key in `SUPABASE_SERVICE_ROLE_KEY` is a long-lived JWT (the legacy Supabase
service-role key format, valid to 2036). Rotating it invalidates the old one
immediately, so the two steps below must happen close together — the app cannot
do privileged writes in between.

Supabase project: `mbncmcwdaevukagidfbe`. Vercel project: `stoneforms`
(`prj_NjNvUm8MJnu7SpQHJEVH2IUoiJnT`, team `bloodstoneprojects`).

```bash
# 1. Rotate in Supabase (dashboard — there is no CLI for this):
#    https://supabase.com/dashboard/project/mbncmcwdaevukagidfbe/settings/api-keys
#    → Legacy API keys → service_role → Rotate. Copy the new key.

cd ~/dev/stoneforms

# 2. Replace it in Vercel. Remove first — `vercel env add` will not overwrite.
vercel env rm SUPABASE_SERVICE_ROLE_KEY production --yes
vercel env add SUPABASE_SERVICE_ROLE_KEY production      # paste the new key

# 3. Redeploy: env vars are read at runtime but the running deployment holds
#    the old values until it is replaced.
vercel --prod --scope bloodstoneprojects

# 4. Prove it took. Without a valid service-role key this logs the
#    "[supabase] SUPABASE_SERVICE_ROLE_KEY is not set" error and privileged
#    writes fall back to anon — which fails silently, so check the logs, not
#    the status code.
vercel logs --scope bloodstoneprojects | grep -i "service_role\|SUPABASE_SERVICE_ROLE_KEY"

# 5. Exercise one privileged write end to end (a form submission that triggers
#    a webhook delivery is the cheapest). A 200 alone proves nothing here —
#    confirm the row actually changed in Supabase.
```

**Do not** put the key in `.env.local` and assume production picked it up;
they are separate. **Do not** skip step 3 — this has been the cause of
"I set it and nothing changed" before.

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

## Tests — `npm test` (fixed 28 Aug 2026)

`lib/__tests__/` holds `endings`, `logic`, `recall` and `variables` — **56
assertions in total**, all passing.

They are plain assertion scripts, not framework tests: each calls
`process.exit(1)` on the first failure and prints a pass count otherwise. They
run under **`tsx`**, which is now a devDependency, via:

```
npm test
```

The script loops over `lib/__tests__/*.test.ts` and propagates a non-zero exit,
so a failing test fails the run. **A new test file is picked up automatically** —
just add it to that directory.

Until 28 Aug 2026 there was no test script at all and these were unrunnable as
checked in.

Migrations are minimal: `database/schema.sql` plus a single
`database/migrations/google_sheets.sql`. Anything else in the live database has
no migration in this repo.
