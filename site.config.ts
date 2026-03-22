/**
 * Site Configuration
 * ==================
 * Edit this file to customise everything for a new client.
 * All components pull from this config — no need to hunt through files.
 */

export const siteConfig = {
  // ── Business Details ──────────────────────────────────────────────
  name: "Starter Agency",
  legalName: "Starter Agency Ltd.",
  tagline: "We build websites that work.",
  description: "A modern web design and development studio. We build fast, beautiful websites for businesses.",
  foundedYear: 2024,
  registrationNumber: "", // Companies House or equivalent

  // ── Contact ───────────────────────────────────────────────────────
  email: "hello@starteragency.com",
  phone: "+44 7000 000000",
  address: {
    street: "123 High Street",
    locality: "London",
    region: "London",
    postcode: "N1 1AA",
    country: "GB",
  },
  geo: {
    latitude: 51.5074,
    longitude: -0.1278,
  },

  // ── URLs ──────────────────────────────────────────────────────────
  siteUrl: "https://starteragency.com",
  social: {
    twitter: "", // e.g. "https://twitter.com/yourbrand"
    youtube: "", // e.g. "https://youtube.com/@yourbrand"
    linkedin: "", // e.g. "https://linkedin.com/company/yourbrand"
    instagram: "", // e.g. "https://instagram.com/yourbrand"
  },

  // ── Design Tokens ─────────────────────────────────────────────────
  colors: {
    primary: "#D4520A",      // CTAs, accents, links, scrollbar
    primaryHover: "#a33d00",  // Darker shade for hover states
    background: "#F5F4F0",   // Cream — alternating section bg
    dark: "#18181b",         // zinc-900 — text, dark sections
  },

  // Fonts are loaded via Google Fonts in BaseLayout.astro
  // Update both here AND the <link> tag in BaseLayout if you change fonts
  fonts: {
    heading: "Inter",        // h1, h2, h3
    body: "Space Grotesk",   // Body text, h4-h6
    accent: "Lora",          // Optional serif for italicized taglines
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@700&family=Space+Grotesk:wght@400;500;700&display=swap",
  },

  // ── Navigation ────────────────────────────────────────────────────
  nav: {
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "News", href: "/news" },
    ],
    cta: { label: "Contact", href: "/contact" },
  },

  // ── Services ──────────────────────────────────────────────────────
  services: [
    {
      title: "Website Design",
      description: "Custom website design and development. Responsive, fast, and SEO-optimised.",
      tag: "Web Design",
      url: "/services/website-design",
      accent: "pink",    // amber | pink | purple | blue | cyan | green
    },
    {
      title: "SEO & Marketing",
      description: "Search engine optimisation to get your business found online by the right people.",
      tag: "SEO",
      url: "/services/seo",
      accent: "blue",
    },
    {
      title: "Branding & Identity",
      description: "Logo design, brand guidelines, and visual identity that makes you memorable.",
      tag: "Branding",
      url: "/services/branding",
      accent: "purple",
    },
  ],

  // ── Hero Section ──────────────────────────────────────────────────
  hero: {
    badge: "Web Design Studio",
    typewriterLines: [
      { white: "Need a ", colored: "website", suffix: "?" },
      { white: "Want more ", colored: "customers?", suffix: "" },
      { white: "Ready to ", colored: "grow online?", suffix: "" },
    ],
    subtitle: "We design and build beautiful websites for businesses of all sizes.",
    primaryCta: { label: "Get Started", href: "/contact" },
    secondaryCta: { label: "Our Work", href: "/services" },
    stats: [
      { value: "50+", label: "Projects Delivered" },
      { value: "5★", label: "Client Reviews" },
    ],
  },

  // ── Chatbot ───────────────────────────────────────────────────────
  chatbot: {
    name: "AI Assistant",
    greeting: "Welcome! How can I help you today?",
    placeholder: "Ask us anything...",
    // The system prompt is in /src/pages/api/chat.ts — edit it there
    // to customise the chatbot's personality and knowledge base
  },

  // ── Footer ────────────────────────────────────────────────────────
  footer: {
    heading: "Let's build something",
    headingAccent: "great.",
    description: "We're a small but experienced web design studio. Get in touch to discuss your project.",
    ctaLabel: "Get in Touch",
    ctaLink: "/contact",
    watermark: "SA", // Large background text (initials)
  },

  // ── Email Recipients ──────────────────────────────────────────────
  emailFrom: "Starter Agency <hello@starteragency.com>",
  emailTo: "hello@starteragency.com",
};

export type SiteConfig = typeof siteConfig;
