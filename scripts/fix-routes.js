import fs from 'fs';

const routesPath = 'dist/_routes.json';

if (!fs.existsSync(routesPath)) {
  console.log('dist/_routes.json not found, skipping');
  process.exit(0);
}

const routes = JSON.parse(fs.readFileSync(routesPath, 'utf8'));

// Remove /sitemap.xml from exclude so it falls through to the Worker,
// which will serve it via the ASSETS binding.
const originalExclude = routes.exclude || [];
routes.exclude = originalExclude.filter(p => p !== '/sitemap.xml');

// Also remove from include if present, to avoid conflicting rules.
const originalInclude = routes.include || [];
routes.include = originalInclude.filter(p => p !== '/sitemap.xml');

fs.writeFileSync(routesPath, JSON.stringify(routes, null, 2));
console.log('Fixed dist/_routes.json for sitemap.xml');
