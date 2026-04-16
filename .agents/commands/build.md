# Build Project

Run the full build pipeline for this Astro project.

## Steps

1. Generate PDF metadata: `npm run generate-data`
2. Build the site: `npm run build`
3. Verify `dist/` output exists.

## Notes

- Always run `generate-data` before `build` if PDFs were added or removed.
- The build output is used for Cloudflare Workers deployment.
