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
- Colors (primary, background, dark)
- Navigation links
- Services (name, description, accent color, URL)
- Hero content (typewriter lines, CTAs, stats)
- Chatbot name and greeting
- Footer content
- Email recipients

## Design Tokens
```
Primary:     #D4520A (burnt-orange) — edit in site.config.ts
Background:  #F5F4F0 (cream) — alternating sections
Dark:        #18181b (zinc-900) — text, dark sections
```

### Typography
- **Headings (h1-h3)**: Inter 700
- **Body & h4-h6**: Space Grotesk
- Loaded via Google Fonts (deferred for performance)

### Spacing Pattern
- Sections: `py-20 md:py-28` or `py-32`
- Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Alternating backgrounds: white, cream, zinc-900

## File Structure
```
site.config.ts              ← EDIT THIS for each client
src/
  layouts/BaseLayout.astro  ← Global layout, fonts, animations
  components/
    Navbar.astro            ← Config-driven nav + mobile menu
    Hero.astro              ← Typewriter hero, concentric rings
    Footer.astro            ← Config-driven footer
    Services.astro          ← Config-driven service cards
    CallToAction.astro      ← Reusable CTA with accent colors
    CookieConsent.astro     ← Cookie banner
    Chatbot.tsx             ← AI chat widget (client:idle)
    ContactForm.tsx         ← Form with AI validation
    NewsletterSignup.tsx    ← Email subscription
  pages/
    index.astro             ← Homepage
    about.astro             ← About page
    services.astro          ← Services overview
    contact.astro           ← Contact form + info
    news/index.astro        ← Blog/news listing
    privacy.astro           ← Privacy policy
    terms.astro             ← Terms of service
    404.astro               ← Not found
    api/
      chat.ts               ← Chatbot API (Gemini)
      contact.ts            ← Contact form (Gemini + Resend)
      validate-contact.ts   ← Form validation (Gemini)
      subscribe.ts          ← Newsletter (Resend)
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
- [ ] Update `tailwind.config.mjs` colors if primary color changes
- [ ] Set up Vercel project and env vars
- [ ] Configure Resend domain for email delivery

## Animations
All pages include:
- Scroll progress bar (colored bar at top of viewport)
- `scroll-reveal` class → fade + slide up on scroll (IntersectionObserver)
- `hero-stagger` → staggered entrance animation
- Concentric rings (hero background)
- Typewriter effect (hero heading)
- Button hover scale (1.03) and active press (0.97)
- Service card hover → background fill transition

## Important Notes
- All styling via Tailwind classes — no separate CSS files
- Use `scroll-reveal opacity-0` class for scroll animations
- Mobile-first responsive design
- Accessibility: skip-to-content, focus states, proper heading hierarchy
- OG images must be JPG (Twitter doesn't support WebP)
- Chatbot system prompt in `/api/chat.ts` needs manual editing per client

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
<div id="scroll-progress" class="fixed top-0 left-0 h-1 bg-[#D4520A] z-[60] transition-all duration-100 ease-out" style="width: 0%" />
```
And the scroll script before `</BaseLayout>`.
