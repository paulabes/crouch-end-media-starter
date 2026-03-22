# Starter Website Template

Config-driven website template built with Astro 5, React 19, and Tailwind CSS. Deployed on Vercel. Duplicate this repo and edit `site.config.ts` for each new client.

## Quick Start

1. **Duplicate the repo** — clone or fork into a new project
2. **Edit `site.config.ts`** — business name, colors, services, contact info, hero content
3. **Update `astro.config.mjs`** — set `site` URL to match the client domain
4. **Edit the chatbot prompt** — customise personality in `src/pages/api/chat.ts`
5. **Copy `.env.example` to `.env`** and add API keys
6. **Replace assets** — favicon (`public/favicon.svg`), OG image (`public/images/og-default.jpg`, 1200x630, JPG only)
7. **Install and run**:
   ```bash
   npm install
   npm run dev
   ```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Astro 5 (server mode) |
| UI Islands | React 19 + TypeScript |
| Styling | Tailwind CSS 3.4 |
| AI | Google Gemini (chatbot + form validation) |
| Email | Resend |
| Rate Limiting | Upstash Redis |
| Analytics | Vercel Speed Insights |
| Deployment | Vercel |

## Config File (`site.config.ts`)

Single source of truth. All components pull from this file.

- Business name, legal name, tagline, description
- Contact details (email, phone, address, geo)
- Site URL and social links
- Design tokens (accent color, background, dark)
- Navigation links
- Services (title, description, tag, URL)
- Hero section (badge, heading lines, subtitle, CTAs, stats)
- Chatbot (name, greeting, placeholder)
- Footer (heading, description, CTA)
- Email recipients (from/to addresses)

## Design Tokens

```
Accent:      #2563eb  (vibrant blue — CTAs, buttons, active states)
Background:  #f4f4f5  (zinc-100 — alternating section backgrounds)
Dark:        #18181b  (zinc-900 — hero sections, dark areas, footer)
```

**Font**: Inter 400/500/600/700 (all text — headings and body)

**Section rhythm**: white → zinc-100 → zinc-900 (alternating)

**Spacing**: `py-24` for all content sections, `pt-48 pb-20` for hero sections

**Border radius**: 5px globally on buttons, inputs, and interactive elements

## Pages

| Page | Path | Notes |
|------|------|-------|
| Home | `/` | Hero, services grid, stats, about teaser, CTA |
| About | `/about` | Values grid, team section |
| Services | `/services` | Auto-populated from config |
| News | `/news` | Blog listing with image placeholders |
| Contact | `/contact` | Contact info + form with AI validation |
| Privacy | `/privacy` | Template privacy policy |
| Terms | `/terms` | Template terms of service |
| 404 | `/404` | Not-found page |

## File Structure

```
site.config.ts              <- EDIT THIS for each client
src/
  layouts/BaseLayout.astro  <- Global layout, fonts, animations
  components/
    Navbar.astro            <- Config-driven nav + services dropdown + mobile menu
    Hero.astro              <- Clean hero with badge, heading, CTAs, stats
    Footer.astro            <- Config-driven footer
    Services.astro          <- Config-driven service cards with hover
    CallToAction.astro      <- Reusable CTA section
    CookieConsent.astro     <- Cookie banner
    Chatbot.tsx             <- AI chat widget (client:idle)
    ContactForm.tsx         <- Form with AI validation + budget slider
    NewsletterSignup.tsx    <- Email subscription
  pages/
    index.astro             <- Homepage
    about.astro             <- About page
    services.astro          <- Services overview
    contact.astro           <- Contact form + info
    news/index.astro        <- Blog/news listing
    privacy.astro           <- Privacy policy
    terms.astro             <- Terms of service
    404.astro               <- Not found
    api/
      chat.ts               <- Chatbot API (Gemini)
      contact.ts            <- Contact form (Gemini + Resend)
      validate-contact.ts   <- Form validation (Gemini)
      subscribe.ts          <- Newsletter (Resend)
```

## Adding Content

### New service page
```
/new-service-page [name]
```
1. Add the service to `site.config.ts` -> `services` array
2. Create `src/pages/services/[slug].astro`
3. Navbar dropdown and footer update automatically

### New article
```
/new-article [topic]
```
1. Create `src/pages/news/[slug].astro`
2. Add to the articles array in `src/pages/news/index.astro`

## Animations

- **Scroll progress bar** — thin accent bar at top fills as user scrolls
- **Scroll reveal** — elements with `scroll-reveal opacity-0` fade + slide up on scroll
- **Hero stagger** — elements enter sequentially with staggered delays
- **Button hover** — scale(1.03) on hover, scale(0.97) on press
- **Service cards** — dark background fill on hover with white text transition

## API Endpoints

| Endpoint | Purpose | Rate Limit |
|----------|---------|------------|
| `/api/chat` | AI chatbot (Gemini) | 50 msg/hr per IP |
| `/api/contact` | Contact form (Gemini validation + Resend) | 5/hr per IP |
| `/api/validate-contact` | Real-time form field validation | -- |
| `/api/subscribe` | Newsletter signup (Resend) | 3/hr per IP |

## Environment Variables

```
GEMINI_API_KEY              # Google Gemini API
RESEND_API_KEY              # Resend email delivery
RESEND_AUDIENCE_ID          # Resend newsletter audience
UPSTASH_REDIS_REST_URL      # Rate limiting
UPSTASH_REDIS_REST_TOKEN    # Rate limiting auth
```

## Claude Code Skills

| Skill | Purpose |
|-------|---------|
| `/check-site` | Run quality checks (build, design, SEO, accessibility, links) |
| `/deploy` | Build, commit, and push to trigger Vercel deploy |
| `/localhost` | Start the dev server |
| `/new-article` | Scaffold a new blog article |
| `/new-service-page` | Scaffold a new service detail page |

## New Client Checklist

- [ ] Duplicate repo and rename
- [ ] Edit `site.config.ts` with all client details
- [ ] Update `astro.config.mjs` site URL
- [ ] Replace `public/favicon.svg` with client logo
- [ ] Add OG image at `public/images/og-default.jpg` (1200x630, JPG)
- [ ] Edit chatbot system prompt in `src/pages/api/chat.ts`
- [ ] Update accent color in `site.config.ts`, `tailwind.config.mjs`, and hardcoded button classes
- [ ] Write real page content (about, services, news)
- [ ] Add team photos to about page
- [ ] Create service detail pages
- [ ] Set up Vercel project with env vars
- [ ] Configure Resend domain for email delivery
- [ ] Run `/check-site` before first deploy

## Important Notes

- All styling via Tailwind classes — no separate CSS files
- Use `scroll-reveal opacity-0` class for scroll animations
- Mobile-first responsive design
- Accessibility: skip-to-content, focus states, proper heading hierarchy
- OG images must be JPG (Twitter doesn't support WebP)
- Chatbot system prompt in `/api/chat.ts` needs manual editing per client
- Nav order: Home, About, Services (dropdown), News, Contact
- Greyscale base with accent color on interactive elements only
