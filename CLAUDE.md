# Starter Website Template

## Overview
Config-driven website template built with Astro 5, React 19 islands, and Tailwind CSS. Deployed on Vercel. Designed by Crouch End Media for internal use — duplicate this repo and edit `site.config.ts` for each new client.

## Quick Start
1. Duplicate this repo
2. Edit `site.config.ts` — business name, colors, services, contact info
3. Update `astro.config.mjs` — set `site` URL
4. Copy `.env.example` to `.env` and add API keys
5. `npm install && npm run dev`

## Tech Stack
- **Framework**: Astro 5 (server mode for API endpoints)
- **Styling**: Tailwind CSS 3.4 (no custom CSS files)
- **Interactive**: React 19 with TypeScript (client:idle / client:visible)
- **Deployment**: Vercel
- **AI**: Google Gemini API (chatbot, form validation)
- **Email**: Resend API
- **Rate Limiting**: Upstash Redis

## Config File (`site.config.ts`)
Single source of truth for:
- Business name, tagline, contact details, address
- Colors (accent, background, dark)
- Navigation links
- Services (name, description, URL)
- Hero content (badge, heading lines, CTAs, stats)
- Chatbot name and greeting
- Footer content
- Email recipients

## Design Tokens
```
Accent:      #2563eb (vibrant blue) — edit in site.config.ts
Background:  #f4f4f5 (zinc-100) — alternating sections
Dark:        #18181b (zinc-900) — hero sections, dark areas, footer
```

### Typography
- **All text**: Inter 400/500/600/700
- Single font family for headings and body
- Loaded via Google Fonts (deferred for performance)

### Spacing Pattern
- Hero sections: `pt-48 pb-20`
- Content sections: `py-24`
- Container: `max-w-7xl mx-auto px-6 md:px-12`
- Alternating backgrounds: white, zinc-100, zinc-900

### Color Scheme
- Greyscale base (whites, greys, blacks)
- Accent color (vibrant blue) on interactive elements only: buttons, CTAs, active nav states, chatbot
- No colored text in headings — plain white on dark, black on light
- All hover states use visible contrast (zinc-600 on dark elements, darker accent on blue elements)

## File Structure
```
site.config.ts              <- EDIT THIS for each client
src/
  layouts/BaseLayout.astro  <- Global layout, fonts, animations, 5px border radius
  components/
    Navbar.astro            <- Config-driven nav + services dropdown + mobile menu
    Hero.astro              <- Clean hero with badge, heading, CTAs, stats (dark bg)
    Footer.astro            <- Config-driven footer (black bg)
    Services.astro          <- Config-driven service cards with hover
    CallToAction.astro      <- Reusable CTA section
    CookieConsent.astro     <- Cookie banner
    Chatbot.tsx             <- AI chat widget (circular blue button, white bg)
    ContactForm.tsx         <- Form with AI validation + budget slider
    NewsletterSignup.tsx    <- Email subscription
  pages/
    index.astro             <- Homepage
    about.astro             <- About page
    services.astro          <- Services overview
    contact.astro           <- Contact form + info
    news/index.astro        <- Blog/news listing with image placeholders
    privacy.astro           <- Privacy policy
    terms.astro             <- Terms of service
    404.astro               <- Not found
    api/
      chat.ts               <- Chatbot API (Gemini)
      contact.ts            <- Contact form (Gemini + Resend)
      validate-contact.ts   <- Form validation (Gemini)
      subscribe.ts          <- Newsletter (Resend)
```

## API Endpoints
| Endpoint | Purpose | Rate Limit |
|----------|---------|------------|
| `/api/chat` | AI chatbot | 50 msg/hr |
| `/api/contact` | Contact form | 5/hr |
| `/api/validate-contact` | Form validation | - |
| `/api/subscribe` | Newsletter | 3/hr |

## Customisation Checklist
- [ ] Edit `site.config.ts` — all business details
- [ ] Update `astro.config.mjs` — site URL
- [ ] Edit chatbot system prompt in `src/pages/api/chat.ts`
- [ ] Replace `/public/favicon.svg` with client logo
- [ ] Add OG image at `/public/images/og-default.jpg` (1200x630, JPG only)
- [ ] Add team photos to about page
- [ ] Write real content for all pages
- [ ] Create service detail pages in `src/pages/services/`
- [ ] Write blog articles in `src/pages/news/`
- [ ] Update accent color in `site.config.ts` and `tailwind.config.mjs`
- [ ] Update hardcoded accent hex values in button classes across components
- [ ] Set up Vercel project and env vars
- [ ] Configure Resend domain for email delivery

## Animations
- Scroll progress bar (accent bar at top of viewport)
- `scroll-reveal` class -> fade + slide up on scroll (IntersectionObserver)
- `hero-stagger` -> staggered entrance animation
- Button hover scale (1.03) and active press (0.97)
- Service card hover -> dark background fill with white text transition

## Important Notes
- All styling via Tailwind classes — no separate CSS files
- Use `scroll-reveal opacity-0` class for scroll animations
- Mobile-first responsive design
- Accessibility: skip-to-content, focus states, proper heading hierarchy
- OG images must be JPG (Twitter doesn't support WebP)
- Chatbot system prompt in `/api/chat.ts` needs manual editing per client
- Nav order: Home, About, Services (dropdown), News, Contact
- 5px border radius applied globally via BaseLayout
- Chatbot button uses inline style `border-radius: 50%` to stay circular
- `scrollbar-gutter: stable both-edges` keeps content centred

## Environment Variables
```
GEMINI_API_KEY              # Google Gemini (chatbot + validation)
RESEND_API_KEY              # Email delivery
RESEND_AUDIENCE_ID          # Newsletter audience
UPSTASH_REDIS_REST_URL      # Rate limiting
UPSTASH_REDIS_REST_TOKEN    # Rate limiting auth
```

## Scroll Progress Bar
Every page should include after `<main>` opens:
```astro
<div id="scroll-progress" class={`fixed top-0 left-0 h-1 bg-[${PRIMARY}] z-[60] transition-all duration-100 ease-out`} style="width: 0%" />
```
And the scroll script before `</BaseLayout>`.
