# New Service Page

Create a new service detail page following the established patterns.

## Usage
```
/new-service-page [service-name]
```

## Instructions

1. **Add the service to `site.config.ts`** in the `services` array:
```typescript
{
  title: "Service Name",
  description: "Brief description",
  tag: "Short Tag",
  url: "/services/service-slug",
  accent: "pink", // amber | pink | purple | blue | cyan | green
}
```

2. **Create the page** at `src/pages/services/[service-slug].astro`:
```astro
---
import { siteConfig } from '../../../site.config';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Navbar from '../../components/Navbar.astro';
import Footer from '../../components/Footer.astro';
import CallToAction from '../../components/CallToAction.astro';

const PRIMARY = siteConfig.colors.primary;
---

<BaseLayout
  title="Service Name | {siteConfig.name}"
  description="Service description for SEO"
>
  <Navbar />
  <main id="main-content" class="bg-[#F5F4F0]">
    <div id="scroll-progress" class="fixed top-0 left-0 h-1 bg-rose-500 z-[60] transition-all duration-100 ease-out" style="width: 0%" />

    <!-- Hero -->
    <section class="pt-48 pb-20 px-6 md:px-12 relative overflow-hidden">
      <!-- Hero content -->
    </section>

    <!-- Feature sections with alternating backgrounds -->

    <CallToAction
      accentColor="pink"
      heading="Ready to get started"
      headingAccent="with [service]?"
      description="Description text"
      buttonText="Get in Touch"
    />
  </main>
  <Footer />
</BaseLayout>
```

3. **Design patterns**:
   - Use the service's accent color for scroll progress bar, badges, highlights
   - Alternating backgrounds: white → cream (#F5F4F0) → zinc-900
   - Use `scroll-reveal opacity-0` for scroll animations
   - Include numbered steps (font-mono text-[10px]) for process sections

4. **The navbar and footer** automatically pick up new services from `site.config.ts`
