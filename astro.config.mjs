import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://jdev-alws.github.io',
  base: '/template',
  integrations: [tailwind({ applyBaseStyles: false })],
  vite: { ssr: { noExternal: ['gsap', 'lenis'] } },
});

