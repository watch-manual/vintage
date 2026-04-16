import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = 'https://vintage.watch-manual.workers.dev';

const calibersData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/calibers.json'), 'utf-8'));

const urls = [
  { loc: '/', priority: '1.0' },
  { loc: '/caliber/', priority: '0.8' },
  { loc: '/category/quartz/', priority: '0.8' },
  { loc: '/category/mechanical/', priority: '0.8' },
];

const caliberKeys = Object.keys(calibersData.caliberMap || {});
for (const caliber of caliberKeys) {
  const encodedCaliber = encodeURIComponent(caliber);
  urls.push({
    loc: `/caliber/${encodedCaliber}/`,
    priority: '0.6',
  });
}

const today = new Date().toISOString().split('T')[0];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ loc, priority }) => `  <url>
    <loc>${BASE_URL}${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

const outputPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(outputPath, sitemap, 'utf-8');

console.log(`Generated sitemap with ${urls.length} URLs at ${outputPath}`);
