# Add New PDFs

Add new PDF files to the vintage watch manual library.

## Steps

1. Place the new PDF files into `public/pdf/`
2. Run `npm run generate-data` to regenerate metadata
3. Verify the new calibers appear in `src/data/calibers.json`
4. Run `npm run build` and check that the new pages are generated in `dist/`

## Important Rules

- Do NOT rename existing PDFs unless you also update `scripts/generate-manifest.js`
- Keep filenames consistent with existing patterns (e.g. `7T32A.pdf`, `2A22A_23A.pdf`)
