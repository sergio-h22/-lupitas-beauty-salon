# Jaeso Studio — website

Marketing site and appointment-booking interface for Jaeso Studio, a boutique
hair studio in Anaheim, CA.

> **Contact details in `lib/business.ts` are placeholders.** Phone, email,
> street address, ZIP, map pin and domain are all stand-ins, each marked
> `PLACEHOLDER` in that file. The phone number sits in the reserved 555-01xx
> range so it cannot dial a real person if it ships by accident. The opening
> hours are a plausible guess, not the studio's — and the booking flow reads
> them directly, so it will sell appointments on whatever days are listed
> there. Replace all of it before launch; see *Before you launch*.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS · Framer Motion.

**📋 [Security & Best Practices](./SECURITY.md)** — Read before deploying to production

---

## What is real and what is not

Read this section before showing the site to anyone.

**Working today, no accounts required** (except admin)

- Every page: home, services, gallery, about, booking, owner dashboard, 404
- Full five-step booking flow with real availability logic — opening hours,
  service durations, double-booking prevention, blocked slots, no past times
- Bilingual English/Spanish across the entire site, with a header switcher
  that remembers the choice and auto-detects Spanish browsers
- Local SEO: metadata, `HairSalon` structured data, sitemap, robots
- Google Maps embed, click-to-call, directions
- Owner dashboard: login-protected, view/approve/cancel appointments, block time off
- **Stripe payment processing** — collect deposits or full payment at booking
  (optional, configurable via environment variables)
- **Admin authentication** — `/admin` requires email + password login (via Supabase)
- **Security hardened**:
  - 30-minute inactivity timeout
  - Rate limiting (prevent brute force)
  - Security headers (HSTS, CSP, X-Frame-Options, etc.)
  - Audit logging (login, appointments, changes)
  - Input validation & XSS protection

**Not real yet — needs an account and keys**

| Feature | What it needs |
|---|---|
| Payment processing | Stripe account (free to set up, pay per transaction) |
| Appointments surviving a browser refresh on another device | A database (Supabase, Neon, Planetscale) |
| Confirmation email | Resend or SendGrid |
| Confirmation text message | Twilio |
| 24-hour reminders, thank-you follow-ups | A scheduled job (Vercel Cron) + the above |
| Newsletter signup actually storing an address | An email provider |

Appointments currently save to `localStorage` — that is, to one browser on one
device. Two customers booking from two phones cannot see each other's slots.
**This is a demo of the booking experience, not a booking system yet.** The
confirmation screen says so to the customer, and the dashboard says so to the
owner. Do not remove those notices until the backend is connected.

---

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

Node 20 or newer.

---

## Stripe Payment Integration (Optional)

To enable payment processing:

1. Create a free [Stripe account](https://stripe.com)
2. Copy `.env.local.example` to `.env.local`
3. Add your Stripe API keys from the [Stripe Dashboard](https://dashboard.stripe.com/apikeys):
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (public key, safe to commit)
   - `STRIPE_SECRET_KEY` (secret key, never commit)
4. Set payment configuration:
   - `NEXT_PUBLIC_PAYMENTS_ENABLED=true` to enable payments
   - `NEXT_PUBLIC_DEPOSIT_CENTS=5000` to collect a $50 deposit (or set to 0 for full payment)

Payments are **optional** — leave `NEXT_PUBLIC_PAYMENTS_ENABLED=false` to book without payment.

When payments are enabled:
- Customers fill in their details, then see a secure Stripe payment form
- Deposits are collected at booking time
- Payment data is encrypted and handled by Stripe (never stored locally)
- Failing to process a test payment? Stripe test mode accepts `4242 4242 4242 4242` with any future expiry and any CVC

---

## Admin Dashboard Authentication (Recommended)

Protect the owner dashboard with a login:

1. Create a free [Supabase account](https://supabase.com)
2. Copy `.env.local.example` to `.env.local`
3. Add your Supabase keys from the [Supabase Dashboard](https://app.supabase.com):
   - `NEXT_PUBLIC_SUPABASE_URL` — your project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — your anon key
4. Create an owner account in Supabase:
   - Go to **Authentication** → **Users**
   - Click **Add user**
   - Enter owner email + password
5. Test: Visit `/admin/login` and sign in with those credentials

**After enabling authentication:**
- `/admin` now requires login
- Owner signs in at `/admin/login`
- Session expires after inactivity
- Sign out button available in dashboard header
- Test account: use any email + password you set in Supabase

**What's still demo mode:**
- Appointments still save to browser `localStorage`
- Two devices cannot see each other's bookings
- When you connect a database (next step), appointments will be real

---

## The design system — "Editorial Atelier"

Read this before adding a section, or the page drifts back toward a template.

**Sections are a numbered sequence, not a stack.** `SectionHeading` takes an
`index` (`"01"`, `"02"`…) that renders as a serial numeral beside the eyebrow.
Continue the numbering when you add a section; the numerals are what make the
page read as composed rather than assembled.

**Vary the composition.** The homepage alternates deliberately: asymmetric
12-column split → full-width index → two-up → dark band. Seven consecutive
centred-heading-over-a-grid sections is the single strongest "AI template"
signal a page can have, however good each section is on its own. `align`
defaults to `left` for that reason.

**The palette is monochrome, and that is the brand.** The studio's identity is
a black disc, a bone card and a signature — three values, no hue. So there is
no accent colour to spend here. Where a gilded salon brand would punctuate with
gold, this one punctuates with contrast: bone on near-black, a hairline, the
signature. `sand` is a warm grey for rules and hover states, not a colour —
at 2.03:1 on bone it is never allowed to carry text (see Accessibility).

**Red belongs to errors alone.** `alert` is a system colour. Nothing
decorative, promotional or seasonal is ever tinted with it — the moment a
banner borrows it, a form error stops reading as a warning.

**Services are an index, not cards.** `ServiceIndex` sets the menu the way a
tasting menu is set — numbered rows, hairline rules, the whole row as the hit
target. `ServiceCard` was deleted; do not reintroduce a bordered card grid.

**Type scale is deliberately gapped.** Use the `display-xl / lg / md / sm`
tokens rather than ad-hoc `text-[clamp(...)]`. Mid-sized headings everywhere is
what makes a page look filled in rather than art-directed. Bodoni carries every
heading at weight 400 — do not bold it. It is a Didone, so its strokes thin as
it scales up and thicken as it scales down: never set body copy in it, and
never set it below about 1.25rem.

**The mark is artwork, not type.** The studio's logo — the signature beside
the drawn figure — ships as vector outlines in `components/brand-art.ts` and
is rendered by `components/BrandMark.tsx`. No script webfont is loaded
anywhere, so the mark cannot reflow or flash a fallback hand mid-load, and it
draws identically in the favicon and the Open Graph card, neither of which can
load a font at all.

`BrandMark` has three cuts, and each exists because one drawing cannot do
every job. `lockup` is the mark as the studio uses it. `word` drops the figure
for the footer sign-off, where at full width the figure would tower over the
columns and read as an illustration. `figure` drops the signature for the
favicon, where a hairline script collapses into a grey smudge at 16px but the
figure keeps a silhouette. Everything paints in `currentColor`, so the mark
inverts by setting a text colour — there is no second copy for dark grounds.

**The mark is a redraw, not the original file.** The signature is outlined
from a script face fitted to the studio's own, and the figure is drawn to
match. It is close, but a signature is exactly the asset where close is not
the same as right. When the real vector arrives from whoever drew it, replace
`WORDMARK` and `SWASH` in `components/brand-art.ts` and the `Figure` in
`BrandMark.tsx` — nothing else in the codebase touches the artwork.

**The mark carries no "STUDIO" line.** The temptation is to bolt the word on
so the header states the business name in full. Setting tracked-out type
beside someone's handwriting is what makes a signature read as a template
instead of as theirs; the full name is carried by the page title, the footer
sign-off and the structured data.

**Motion has one signature.** Content lifts (`<Reveal>`), headings unmask
(`variant="mask"`), rules draw (`variant="rule"`). Three variants, one easing
curve (`ease-luxe`). Do not add a fourth.

**Buttons have three weights.** `.btn-primary` (fill), `.btn-outline`
(hairline), `.btn-quiet` (bare text with a rule that draws on hover), plus
`-ondark` variants. Hierarchy comes from weight, not from new shapes.

---

## The files you will actually edit

### `lib/business.ts` — name, phone, address, hours

Every value marked `PLACEHOLDER` in this file is a stand-in and must be
replaced. That is: phone, email, street, ZIP, geo, `siteUrl`, and all seven
lines of `HOURS`.

Hours drive the booking calendar, the footer, the location section and the
structured data at once. Sunday and Monday are currently set closed; change
`open`/`close` to `null` to close another day. **These are a guess.** The
booking flow offers appointments on whatever this file says is open, so a
wrong line here books a client into a locked studio.

`BUSINESS.siteUrl` is used for canonical URLs and the sitemap. **Change it to
the real domain before launch** or Google will be told the wrong address.

`BUSINESS.geo` is currently the Anaheim city centroid, not the studio.
Replace it with the exact coordinates from the Google Business Profile or the
map link will land down the road.

### `lib/services.ts` — the service menu

One array. Add, edit or remove an entry and the services page, the homepage
grid, the booking flow's first step and the duration used to compute available
times all update together.

`price: ''` renders "Quote on request". **No price on this site is invented** —
fill these in when you decide them.

`minutes` is what the booking system actually reserves. A 45-minute haircut
blocks 45 minutes; a 3-hour highlight blocks 3 hours and will not be offered
at 5:30 PM when you close at 7.

### `lib/specialists.ts` — the team

Three placeholder stylists with placeholder names and biographies. These names
are shown to clients as the person who will be cutting their hair, so replace
all three before launch. Set `photo` to a path under `/public` and the placeholder
tile is replaced automatically.

### `lib/i18n.tsx` — all site copy, both languages

Every visible string lives here as an `{ en, es }` pair. To change wording,
change it here rather than in a component, and both languages stay in sync.

The Spanish is real translation, not machine output — but a native speaker
should still read it once before launch.

---

## Before you launch

In rough priority order.

1. **Replace every `PLACEHOLDER` in `lib/business.ts`** — phone, email, street,
   ZIP, map pin, domain, and all seven lines of `HOURS`. Nothing else on this
   list matters if the site publishes the wrong phone number or takes bookings
   on a closed day.
2. **Real photography.** Every image is a labelled placeholder. This design
   depends on photographs, and more than most: the palette has no colour in it,
   so the photographs are the only colour on the page. Shoot the studio
   interior, stylists working, and genuine before/after pairs. Start with the
   homepage and the six gallery slots.
3. **Replace the three specialists** with real names, roles and biographies.
4. **Decide the prices** or leave them as quote-on-request deliberately.
5. **Replace the placeholder reviews.** These are marked as placeholders and
   carry no review structured data on purpose — publishing invented reviews as
   real ones risks a Google penalty. Collect real ones first, then add
   `AggregateRating`.
6. **Fill in the three promotional offers** in the promos section, or remove it.
7. **Create the Google Business Profile.** This matters more for "hair salon
   near me" than anything on the website. The site's structured data supports
   it but cannot substitute for it.
8. **Connect a database** so bookings are real.
9. **Put `/admin` behind a login.**

---

## Hosting

**Vercel** is the recommendation. It is built by the same team as Next.js, the
free tier covers a studio's traffic, HTTPS and a global CDN are automatic, and
deploys happen on every push with no configuration. Connect the GitHub repo at
vercel.com and it detects everything.

**Netlify** is equally good for a static marketing site and slightly weaker on
Next.js server features. Fine here, since every page is currently static.

**Avoid GoDaddy hosting.** It is built for PHP and WordPress; running a Next.js
app there means paying more for a worse deploy story. Buying the *domain* at
GoDaddy is fine — you point it at Vercel with two DNS records.

Rough costs: domain $10–15/year, hosting $0 on Vercel's free tier, Supabase $0
to start, Twilio SMS about $0.008 per message, Resend free to 3,000 emails a
month.

---

## Connecting the backend later

The booking UI never talks to `localStorage` directly — it goes through four
functions in `lib/booking.ts`:

```
loadAppointments()   saveAppointment()   loadBlocked()   saveBlocked()
```

Replace those four with `fetch` calls to API routes and every screen keeps
working unchanged. The availability logic in `availableSlots()` is already
pure and server-safe — it takes appointments as an argument rather than
reading storage itself, so it can move to the server as-is.

A minimum schema:

```sql
create table appointments (
  id uuid primary key default gen_random_uuid(),
  service_id text not null,
  specialist_id text not null,
  date date not null,
  time time not null,
  minutes int not null,
  name text not null,
  phone text not null,
  email text not null,
  notes text,
  status text not null default 'pending',
  created_at timestamptz default now()
);
```

Validate the slot **server-side** on write. A client can send any time it
likes; the browser check is convenience, not a guarantee. Add a uniqueness
constraint on `(specialist_id, date, time)` so two simultaneous bookings
cannot take the same slot.

---

## SEO

Targeting: *hair studio Anaheim CA*, *boutique hair salon Anaheim*, *balayage
Anaheim*, *hair color specialist Anaheim*, *estudio de cabello Anaheim*.

Published structured data:

| Page | Declares |
|---|---|
| All | `HairSalon` — address, phone, hours, area served, languages |
| Sitemap | 5 public URLs, `/admin` excluded |

**One limit worth knowing.** Ranking for "near me" searches is decided mostly
by the Google Business Profile, not the website. Claiming and completing that
profile — correct hours, real photos, review requests — will do more for
bookings than any further change to this code.

Deliberately omitted: `Review` and `AggregateRating` markup, because the
current reviews are placeholders; and `Product` markup on services, because a
price-less `Product` reports a missing-offer error. Services are modelled as
part of the studio entity instead.

---

## Accessibility

Checked, not assumed:

- Brand palette measured against WCAG. `sand` `#B9AA96` is **2.03:1 on bone** —
  it fails as text on light grounds, so it is used only for rules, borders and
  hover states. Text needing that warmth uses `sand.text` `#6E6252` (5.32:1),
  and on near-black `sand.soft` `#D8CDBC` (12.61:1). **Do not set body text in
  `#B9AA96` on bone.**
- The lightest text tone, `ink.faint` `#6B6355`, measures 5.31:1 on bone and
  4.73:1 on bone-deep — it carries small meta text (durations, prices,
  captions) so it has to clear AA on both grounds. An earlier, prettier
  `#948C81` measured 2.90:1 and was rejected.
- `alert` `#C0463C` is a fill and hairline only (4.49:1 — short of AA for body
  text). Error text uses `alert.text` `#94291F` (7.24:1 on bone), and the
  inverted footer uses `alert.soft` `#E8A9A0` (10.01:1 on ink).
- Body text 6.38:1, headings 17.7:1.
- The monochrome palette means colour is never the sole carrier of meaning
  anywhere on the site — which was true of the previous palette by discipline,
  and is now true by construction.
- Every interactive target is at least 44×44px.
- Visible focus rings everywhere; none are removed.
- `prefers-reduced-motion` forces every reveal to its resting state rather than
  merely shortening it — reveals start at `opacity: 0`, so "faster" would still
  mean invisible.
- A `<noscript>` block restores that same resting state, so the page is fully
  readable with JavaScript disabled.
- The mobile drawer is a labelled `role="dialog"`, locks body scroll, closes on
  Escape, and takes its links out of the tab order while hidden.
- Form errors sit beside their field, are announced via `aria-describedby`, and
  mark the input `aria-invalid`.
- Language switching updates `<html lang>` so screen readers change voice.

Verified in Chromium at 390 / 834 / 1440 / 1920 px: no horizontal overflow on
any page, no reveal left stuck at zero opacity, drawer and booking flow both
complete, and the console is clean — no JS errors, no failed requests.

## Performance

- Every page prerenders as static HTML.
- **Five font weights across two families.** Bodoni Moda 400/500 and Jost
  300/400/500, self-hosted through `next/font`. There is deliberately no
  script face: the signature is artwork and ships as vector outlines, so the
  wordmark costs no font request at all.
- **The mark is inline SVG, roughly 8 kB of path data.** It appears twice per
  page (header and footer), but the second copy is a byte-identical string and
  compresses to almost nothing, and inlining avoids a render-blocking request
  for the one element that is above the fold on every page.
- **No animation library.** Scroll reveals are CSS transitions toggled by a
  single shared `IntersectionObserver` (`components/Reveal.tsx`), replacing
  framer-motion — roughly 50 kB gzipped removed from every page for motion
  that CSS does natively.
- **Stripe.js is never fetched unless payments are configured.** The import
  uses `@stripe/stripe-js/pure`; the plain entrypoint injects the js.stripe.com
  script as a module side-effect, so importing it at all would cost every
  booking-page visitor a third-party request.
- The hero video is gated behind `HERO_VIDEO` in `lib/business.ts`: while those
  paths are empty no video element mounts and nothing is requested. When you
  add footage, it loads only after the hero scrolls into view and is skipped
  entirely on Save-Data or 2G/3G connections.
- Animations move `transform` and `opacity` only, never `width`/`height`, so
  they cannot cause layout shift.
- Photographs go through `next/image` with explicit `sizes`, and every
  placeholder reserves its aspect ratio, so dropping in real photos will not
  move the page.

Compress hero footage hard — under 3 MB, ideally WebM plus MP4 — and export
photographs as WebP. That is where the 3-second budget will be won or lost.
