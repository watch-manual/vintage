import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import pagefind from 'astro-pagefind';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://vintage.watchdoc.workers.dev',
  output: 'static',
  integrations: [
    tailwind(),
    pagefind()
  ],
  build: {
    format: 'directory'
  },
  adapter: cloudflare()
});
