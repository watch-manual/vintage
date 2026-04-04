import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import pagefind from 'astro-pagefind';

export default defineConfig({
  output: 'static',
  site: 'https://vintage.watch-manual.workers.dev',
  integrations: [
    tailwind(),
    pagefind()
  ],
  build: {
    format: 'directory'
  }
});
