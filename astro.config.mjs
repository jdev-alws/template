import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

// Static by default (fastest on Cloudflare Pages). The adapter is wired in so you
// can opt individual routes into SSR later with `export const prerender = false`.
export default defineConfig({
  site: 'https://glowence.pages.dev',
  output: 'hybrid',
  adapter: cloudflare({ imageService: 'passthrough' }),
  integrations: [tailwind({ applyBaseStyles: false })],
  vite: { ssr: { noExternal: ['gsap', 'lenis'] } },
});
