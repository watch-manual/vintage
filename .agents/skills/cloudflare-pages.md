# Cloudflare Pages Skill

## Hosting
This site is deployed to Cloudflare Pages.

## Build Settings
| Setting | Value |
|---------|-------|
| Build command | `npm run generate-data && npm run build` |
| Output directory | `dist` |
| Root directory | `/` |

## Custom Headers
The `_headers` file at the project root configures caching:
- PDF files are cached for 1 year.

## Deployment Notes
- Do not modify `_headers` unless you understand Cloudflare Pages header syntax.
- The `dist/` directory is generated; never edit it manually.
