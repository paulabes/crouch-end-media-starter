import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    tailwind(),
    sitemap(),
  ],
  output: 'server',
  adapter: vercel(),
  site: 'https://starteragency.com', // ← Update to match siteConfig.siteUrl
  devToolbar: {
    enabled: false
  },
  vite: {
    resolve: {
      alias: {
        '@': new URL('./', import.meta.url).pathname,
      },
    },
  },
});
