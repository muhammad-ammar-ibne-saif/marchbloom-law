# March & Bloom Law — Next.js rebuild

A like-for-like rebuild of the March & Bloom Law marketing site on Next.js 14
(App Router), TypeScript, Tailwind CSS v3, and Framer Motion — replacing the
previous funnel-builder platform with a fast, version-controlled codebase,
plus a self-owned lead pipeline: every quote submission is saved to MongoDB,
emailed to the firm, and viewable in a password-protected admin dashboard.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in the values, see below
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```

Fonts (Fraunces + Inter) are self-hosted via `@fontsource`, so the build has
no dependency on Google Fonts' servers.

## Environment variables

See `.env.example` for the full list. Three things to set up before this
works end to end:

1. **MongoDB** — a free cluster at mongodb.com/cloud/atlas is enough for this
   volume. Paste the connection string into `MONGODB_URI`.
2. **Resend** (email notifications) — sign up at resend.com, verify the
   firm's sending domain, and set `RESEND_API_KEY`, `RESEND_FROM_EMAIL`
   (must be on the verified domain), and `LEAD_NOTIFICATION_EMAIL` (where
   alerts land — Kiran's inbox, most likely).
3. **Admin login** — set `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and a random
   `SESSION_SECRET` (generate one with `openssl rand -hex 32`). This is a
   single shared admin login, not per-user accounts — fine for one person
   checking leads, but worth upgrading if more than one person needs access
   with separate audit trails later.

If `MONGODB_URI` or the Resend variables are missing, the app still builds
and runs — lead submissions just fail gracefully (logged to the server
console) instead of crashing the site.

## Pages

| Route                  | Purpose                                   |
| ----------------------- | ------------------------------------------ |
| `/`                     | Home — hero, services, differentiators, FAQ |
| `/about-us`             | About, team, FAQ                          |
| `/our-services`         | Service detail cards + FAQ                |
| `/price-transparency`   | Fee tables, disbursements, team rates     |
| `/complaints-procedure` | SRA-mandated complaints process           |
| `/terms-of-use`         | Website terms                             |
| `/privacy-policy`       | Data handling (new — see notes below)     |
| `/book-a-consultation`  | The instant quote calculator + lead capture |
| `/admin`                | Leads dashboard (password-protected)      |
| `/admin/leads/[id]`     | Single lead detail view                   |

All marketing-site copy, navigation, FAQs, pricing rows, and team details
live in `lib/data.ts`. The marketing pages live under `app/(site)/` (a route
group, so the URLs are unaffected) and share a layout with the header and
footer; `/admin` has its own separate, header/footer-free layout.

## How the lead pipeline works

1. `components/InstantQuote.tsx` runs the 4-step calculator (transaction
   type → property value & tenure → live estimate → contact details).
2. On submit, it posts JSON to `app/api/leads/route.ts`, which validates the
   payload, saves it to the `leads` collection in MongoDB
   (`lib/leads.ts`), and fires a notification email via Resend
   (`lib/email.ts`) — the email send never blocks or fails the save.
3. A hidden honeypot field (`name="company"`) catches the most basic bots;
   real users never see or fill it in.
4. The admin dashboard at `/admin` (`app/admin/page.tsx`) queries MongoDB
   directly as a Server Component — search by name/email/phone, filter by
   transaction type, status, or date range, with pagination.
5. Clicking "Details" on any row opens `/admin/leads/[id]`, a full readable
   breakdown of everything that lead submitted, plus a status dropdown
   (New → Contacted → Quoted → Instructed → Completed) that updates via a
   server action (`lib/actions.ts`).

Authentication is a single admin username/password checked against env
vars (`app/api/auth/login/route.ts`), with a signed, httpOnly session
cookie verified on every request to `/admin/*` by `middleware.ts`. No
passwords or sessions are stored in the database.

## What changed from the old site, and why

- **Privacy Policy**: the live site's Privacy Policy link 404s. This rebuild
  ships a real one — review and refine the wording with whoever handles your
  data protection compliance before going live.
- **Fixed typos**: "Tennant" → "Tenant", "a Instant Quote" → grammatically
  corrected, and the Terms of Use page no longer references the wrong domain
  (`marchandbloomlaw.com`).
- **A fully self-owned lead pipeline**: the live site's lead form ran through
  a third-party GoHighLevel/LeadConnector account controlled by the previous
  developer — which is the reason the firm had no visibility into its own
  leads in the first place. This rebuild replaces that entirely with the
  firm's own database, own email sending, and own dashboard, so the same
  problem can't recur if any future developer relationship ends.
- **Remortgage pricing is a placeholder**: the live site has no published fee
  scale for remortgages (only a flat mortgage admin/redemption disbursement).
  `lib/pricing.ts` uses a stand-in base fee for that branch — replace
  `remortgageBaseFee` with the firm's real rate before launch.
- **One consistent timeline**: the live site quotes "8–16 weeks" on the FAQ
  but "10–12 / 12–14 weeks" on the pricing page. This rebuild uses one set of
  figures across both — update `lib/data.ts` if the real numbers differ.
- **Testimonials**: the live site has a testimonials heading with no actual
  reviews wired in (it relies on a third-party review-widget iframe). This
  rebuild leaves a placeholder section ready for real review data — wire it
  to your review provider's embed or API before launch.

## Design notes

Palette and type are defined as design tokens in `tailwind.config.ts`
(`ink`, `bone`, `brass`, `clay`) rather than one-off hex values in
components, so the whole look can be retuned from one file. Animations use
`prefers-reduced-motion` fallbacks in `app/globals.css`.

## Before going live

- Replace the placeholder `BloomMark` SVG with the firm's actual logo file.
- Set up MongoDB, Resend, and the admin credentials per the environment
  variables section above — none of the lead pipeline works without them.
- Change `ADMIN_PASSWORD` and `SESSION_SECRET` to real, unique values before
  deploying anywhere public; the ones in `.env.example` are placeholders.
- Confirm the remortgage fee logic in `lib/pricing.ts` against the firm's
  actual rate card — see the note above.
- Confirm the registered office, correspondence address, phone numbers, and
  SRA/company numbers in `lib/data.ts` are current.
- Add a favicon and Open Graph image in `app/` (Next.js picks up
  `favicon.ico`, `opengraph-image.png`, etc. automatically by filename).
- `components/ContactForm.tsx` is no longer used on any page — keep it as a
  simpler fallback form elsewhere, or delete it.
- Consider adding a CAPTCHA (e.g. Cloudflare Turnstile) alongside the
  honeypot if spam submissions become an issue once the site is public.
