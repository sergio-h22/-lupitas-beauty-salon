# Lupita's Beauty Salon — website

Marketing site and appointment-booking interface for Lupita's Beauty Salon,
700 W Orangewood Ave, Anaheim, CA 92802.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS · Framer Motion.

---

## What is real and what is not

Read this section before showing the site to anyone.

**Working today, no accounts required**

- Every page: home, services, gallery, about, booking, owner dashboard, 404
- Full five-step booking flow with real availability logic — opening hours,
  service durations, double-booking prevention, blocked slots, no past times
- Bilingual English/Spanish across the entire site, with a header switcher
  that remembers the choice and auto-detects Spanish browsers
- Local SEO: metadata, `HairSalon` structured data, sitemap, robots
- Google Maps embed, click-to-call, directions
- Owner dashboard: view/approve/cancel appointments, block time off

**Not real yet — needs an account and keys**

| Feature | What it needs |
|---|---|
| Appointments surviving a browser refresh on another device | A database (Supabase, Neon, Planetscale) |
| Confirmation email | Resend or SendGrid |
| Confirmation text message | Twilio |
| 24-hour reminders, thank-you follow-ups | A scheduled job (Vercel Cron) + the above |
| Newsletter signup actually storing an address | An email provider |
| A secure owner dashboard | Real authentication |

Appointments currently save to `localStorage` — that is, to one browser on one
device. Two customers booking from two phones cannot see each other's slots.
**This is a demo of the booking experience, not a booking system yet.** The
confirmation screen says so to the customer, and the dashboard says so to the
owner. Do not remove those notices until the backend is connected.

`/admin` has **no password**. It is `noindex`ed and excluded in `robots.txt`,
but that hides it from search engines, not from people. Put it behind real
authentication before the site goes live.

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

## The files you will actually edit

### `lib/business.ts` — name, phone, address, hours

Hours drive the booking calendar, the footer, the location section and the
structured data at once. Tuesday is set closed; change `open`/`close` to `null`
to close another day.

`BUSINESS.siteUrl` is used for canonical URLs and the sitemap. **Change it to
the real domain before launch** or Google will be told the wrong address.

`BUSINESS.geo` is an approximate pin. Replace it with the exact coordinates
from your Google Business Profile.

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

Three placeholder stylists with placeholder names and biographies. Replace all
three before launch. Set `photo` to a path under `/public` and the placeholder
tile is replaced automatically.

### `lib/i18n.tsx` — all site copy, both languages

Every visible string lives here as an `{ en, es }` pair. To change wording,
change it here rather than in a component, and both languages stay in sync.

The Spanish is real translation, not machine output — but a native speaker
should still read it once before launch.

---

## Before you launch

In rough priority order.

1. **Real photography.** Every image is a labelled placeholder. This design
   depends on photographs — the salon interior, stylists working, and genuine
   before/after pairs. Start with the homepage and the six gallery slots.
2. **Set the real domain** in `lib/business.ts`.
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
free tier covers a salon's traffic, HTTPS and a global CDN are automatic, and
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

Targeting: *hair salon Anaheim CA*, *beauty salon near Disneyland*, *women's
haircut Anaheim*, *hair color specialist Anaheim*, *salón de belleza Anaheim*.

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
part of the salon entity instead.

---

## Accessibility

Checked, not assumed:

- Brand palette measured against WCAG. Champagne gold `#D4AF37` is **1.95:1 on
  cream** — it fails badly as text on light backgrounds, so it is used only for
  rules, borders and gold-on-black. Text needing gold uses `#7A5F18` (5.61:1).
  The same applies to soft rose: `#D8A7A7` decoratively, `#8C5252` (5.66:1) for
  text. **Do not set body text in `#D4AF37` on cream.**
- Body text 6.15:1, headings 17.5:1.
- Every interactive target is at least 44×44px.
- Visible focus rings everywhere; none are removed.
- `prefers-reduced-motion` disables all scroll animations and smooth scrolling.
- Form errors sit beside their field, are announced via `aria-describedby`, and
  mark the input `aria-invalid`.
- Language switching updates `<html lang>` so screen readers change voice.

Verified end-to-end in Chromium: all pages render, the booking flow completes,
validation catches every empty field, the booking appears in the dashboard,
and the console is clean — no JS errors, no failed requests.

## Performance

- Every page prerenders as static HTML.
- Fonts self-hosted through `next/font` — no render-blocking Google Fonts.
- The hero video is gated behind `HERO_VIDEO` in `lib/business.ts`: while those
  paths are empty no video element mounts and nothing is requested. When you
  add footage, it loads only after the hero scrolls into view and is skipped
  entirely on Save-Data or 2G/3G connections.
- Animations move `transform` and `opacity` only, never `width`/`height`, so
  they cannot cause layout shift.
- Image placeholders reserve their aspect ratio, so dropping in real photos
  will not move the page.

Compress hero footage hard — under 3 MB, ideally WebM plus MP4 — and export
photographs as WebP. That is where the 3-second budget will be won or lost.
