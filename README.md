# Crouch End Media — Starter Template

Config-driven website template built with Astro 5, React 19, and Tailwind CSS. Deployed on Vercel. Duplicate this repo for each new client project.

## Quick Start

1. **Duplicate the repo** — clone or fork into a new project
2. **Edit `site.config.ts`** — business name, colors, services, contact info, hero content, chatbot, footer
3. **Update `astro.config.mjs`** — set `site` URL to match the client domain
4. **Edit the chatbot prompt** — customise personality and service knowledge in `src/pages/api/chat.ts`
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

Single source of truth. All components pull from this file — no need to hunt through templates.

- Business name, legal name, tagline, description
- Contact details (email, phone, address, geo)
- Site URL and social links
- Design tokens (primary color, hover color, background)
- Navigation links
- Services (title, description, tag, URL, accent color)
- Hero section (badge, typewriter lines, subtitle, CTAs, stats)
- Chatbot (name, greeting, placeholder)
- Footer (heading, description, CTA, watermark text)
- Email recipients (from/to addresses)

## Pages

| Page | Path | Notes |
|------|------|-------|
| Home | `/` | Hero with typewriter, services grid, stats, about teaser, CTA |
| About | `/about` | Values grid, team placeholders |
| Services | `/services` | Auto-populated from config |
| News | `/news` | Blog listing with placeholder articles |
| Contact | `/contact` | Contact info + form with AI validation |
| Privacy | `/privacy` | Template privacy policy |
| Terms | `/terms` | Template terms of service |
| 404 | `/404` | Animated not-found page |

## Adding Content

### New service page
```
/new-service-page [name]
```
1. Add the service to `site.config.ts` → `services` array
2. Create `src/pages/services/[slug].astro`
3. Navbar and footer update automatically

### New article
```
/new-article [topic]
```
1. Create `src/pages/news/[slug].astro`
2. Add to the articles array in `src/pages/news/index.astro`

## Animations

All pages include these micro animations out of the box:

- **Scroll progress bar** — thin colored bar at top fills as user scrolls
- **Scroll reveal** — elements with `scroll-reveal opacity-0` fade + slide up on scroll
- **Hero stagger** — elements enter sequentially with 0.2s delays
- **Typewriter** — hero heading types, deletes, and cycles through configured lines
- **Concentric rings** — expanding circular waves behind hero
- **Button hover** — scale(1.03) on hover, scale(0.97) on press
- **Service cards** — full accent color fill on hover with text color transition
- **Value props** — numbered items with heading color change on hover
- **Watermark text** — giant faded text in section backgrounds

## API Endpoints

| Endpoint | Purpose | Rate Limit |
|----------|---------|------------|
| `/api/chat` | AI chatbot (Gemini) | 50 msg/hr per IP |
| `/api/contact` | Contact form (Gemini validation + Resend) | 5/hr per IP |
| `/api/validate-contact` | Real-time form field validation | — |
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
- [ ] Update `tailwind.config.mjs` if primary color changes
- [ ] Write real page content (about, services, news)
- [ ] Add team photos to about page
- [ ] Create service detail pages
- [ ] Set up Vercel project with env vars
- [ ] Configure Resend domain for email delivery
- [ ] Create GitHub repo and push
- [ ] Run `/check-site` before first deploy

## Design Tokens

```
Primary:     #D4520A  (burnt-orange — CTAs, accents, scrollbar)
Background:  #F5F4F0  (cream — alternating section backgrounds)
Dark:        #18181b  (zinc-900 — text, dark sections, footer)
```

**Fonts**: Inter 700 (h1-h3), Space Grotesk 400/500/700 (body, h4-h6)

**Section rhythm**: white → cream → zinc-900 (alternating)

**Spacing**: `py-20 md:py-28` or `py-32` for sections, `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` for containers
