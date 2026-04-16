# Astro Development Skill

## Project Type
Astro 5.x static site with Tailwind CSS 3.x and Pagefind search.

## Key Commands
- `npm run dev` – Start dev server on http://localhost:4321
- `npm run generate-data` – Regenerate `src/data/calibers.json`
- `npm run build` – Build to `dist/`
- `npm run preview` – Preview production build

## Coding Guidelines
- Use Astro components (`.astro`) for UI.
- Use Tailwind utility classes for styling.
- Keep data logic in `scripts/generate-manifest.js`.
- Do not manually edit `src/data/calibers.json`; regenerate via script.
