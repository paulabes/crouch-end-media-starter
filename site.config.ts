/**
 * Site Configuration
 * ==================
 * Edit this file to customise everything for a new client.
 * All components pull from this config — no need to hunt through files.
 */

export const siteConfig = {
  // ── Business Details ──────────────────────────────────────────────
  name: "Your Business Name",
  legalName: "Your Business Name Ltd.",
  tagline: "Quality service you can trust.",
  description: "A friendly, reliable local business dedicated to delivering excellent service. We put our customers first and take pride in everything we do.",
  foundedYear: 2024,
  registrationNumber: "", // Companies House or equivalent

  // ── Contact ───────────────────────────────────────────────────────
  email: "hello@yourbusiness.com",
  phone: "+44 20 1234 5678",
  address: {
    street: "123 High Street",
    locality: "Your Town",
    region: "Your County",
    postcode: "AB1 2CD",
    country: "GB",
  },
  geo: {
    latitude: 51.5074,
    longitude: -0.1278,
  },

  // ── URLs ──────────────────────────────────────────────────────────
  siteUrl: "https://yourbusiness.com",
  social: {
    twitter: "", // e.g. "https://twitter.com/yourbrand"
    youtube: "", // e.g. "https://youtube.com/@yourbrand"
    linkedin: "", // e.g. "https://linkedin.com/company/yourbrand"
    instagram: "", // e.g. "https://instagram.com/yourbrand"
  },

  // ── Design Tokens ─────────────────────────────────────────────────
  colors: {
    primary: "#2563eb",      // Vibrant blue — CTAs, accents, links, scrollbar
    primaryHover: "#1d4ed8",  // Darker blue — hover states
    accent: "#2563eb",       // Blue accent
    background: "#f4f4f5",   // zinc-100 — alternating section bg
    dark: "#18181b",         // zinc-900 — text, dark sections
  },

  // Fonts are loaded via Google Fonts in BaseLayout.astro
  // Update both here AND the <link> tag in BaseLayout if you change fonts
  fonts: {
    heading: "Inter",        // h1, h2, h3
    body: "Inter",           // Body text
    accent: "Lora",          // Optional serif for italicized taglines
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
  },

  // ── Navigation ────────────────────────────────────────────────────
  nav: {
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "News", href: "/news" },
    ],
    cta: { label: "Contact", href: "/contact" },
  },

  // ── Services ──────────────────────────────────────────────────────
  services: [
    {
      title: "Consultations",
      description: "One-to-one consultations tailored to your needs. We listen, advise, and help you make the right decisions.",
      tag: "Consulting",
      url: "/services/consultations",
      accent: "pink",    // amber | pink | purple | blue | cyan | green
    },
    {
      title: "Ongoing Support",
      description: "Reliable, responsive support whenever you need it. We're here to keep things running smoothly.",
      tag: "Support",
      url: "/services/support",
      accent: "blue",
    },
    {
      title: "Custom Solutions",
      description: "Bespoke solutions designed around your business. No off-the-shelf packages — just what works for you.",
      tag: "Solutions",
      url: "/services/solutions",
      accent: "purple",
    },
  ],

  // ── Hero Section ──────────────────────────────────────────────────
  hero: {
    badge: "Local & Trusted",
    typewriterLines: [
      { white: "Need expert ", colored: "advice", suffix: "?" },
    ],
    subtitle: "We help small businesses succeed with honest advice, quality work, and personal service you can rely on.",
    primaryCta: { label: "Get a Free Quote", href: "/contact" },
    secondaryCta: { label: "Our Services", href: "/services" },
    stats: [
      { value: "10+", label: "Years Experience" },
      { value: "5★", label: "Customer Reviews" },
    ],
  },

  // ── Chatbot ───────────────────────────────────────────────────────
  chatbot: {
    name: "Assistant",
    greeting: "Hi there! Got a question about our services? I'm happy to help.",
    placeholder: "Ask about our services...",
    // The system prompt is in /src/pages/api/chat.ts — edit it there
    // to customise the chatbot's personality and knowledge base
  },

  // ── Footer ────────────────────────────────────────────────────────
  footer: {
    heading: "Let's work",
    headingAccent: "together.",
    description: "We're a small, dedicated team that cares about doing great work. Get in touch to see how we can help your business.",
    ctaLabel: "Get in Touch",
    ctaLink: "/contact",
    watermark: "YB", // Large background text (initials)
  },

  // ── Email Recipients ──────────────────────────────────────────────
  emailFrom: "Your Business Name <hello@yourbusiness.com>",
  emailTo: "hello@yourbusiness.com",
};

export type SiteConfig = typeof siteConfig;
