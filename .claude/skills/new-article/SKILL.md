# New Article

Create a new article/blog post with proper structure and SEO.

## Usage
```
/new-article [topic]
```

## Instructions

When creating a new article:

1. **Create the file** at `src/pages/news/[slug].astro`

2. **Follow the standard structure**:
```astro
---
import { siteConfig } from '../../../site.config';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Navbar from '../../components/Navbar.astro';
import Footer from '../../components/Footer.astro';
import NewsletterSignup from '../../components/NewsletterSignup';

const PRIMARY = siteConfig.colors.primary;
---

<BaseLayout
  title="Article Title | {siteConfig.name}"
  description="Article description under 160 chars"
>
  <Navbar />
  <main id="main-content" class="bg-[#F5F4F0]">
    <div id="scroll-progress" class={`fixed top-0 left-0 h-1 bg-[${PRIMARY}] z-[60] transition-all duration-100 ease-out`} style="width: 0%" />

    <!-- Article Hero -->
    <section class="pt-48 pb-20 px-6 md:px-12">
      <div class="max-w-3xl mx-auto">
        <div class="inline-block px-3 py-1 bg-rose-500/20 border border-rose-500/40 text-rose-500 font-grotesk text-xs font-bold uppercase tracking-widest mb-8">
          Category
        </div>
        <h1>Article Title</h1>
        <p class="font-grotesk text-xl text-zinc-600 font-bold mt-8">Intro paragraph</p>
      </div>
    </section>

    <!-- Article Content -->
    <section class="pb-20 px-6 md:px-12">
      <div class="max-w-3xl mx-auto font-grotesk text-lg text-zinc-700 leading-relaxed space-y-8">
        <!-- Content here -->
      </div>
    </section>

    <NewsletterSignup client:visible />
  </main>
  <Footer />

  <!-- Scroll progress script -->
</BaseLayout>
```

3. **Add article to the listing** in `src/pages/news/index.astro` articles array

4. **Tag colors**: rose, indigo, violet, amber

5. **OG Image**: Add at `public/images/article-[slug].jpg` (1200x630, JPG)
