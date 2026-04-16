# Cloudflare Workers Skill

## Hosting
This site is deployed to Cloudflare Workers with Static Assets.

## Build Settings
| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Output directory | `dist` |
| Root directory | `/` |

## Custom Headers
The `_headers` file at the project root configures caching:
- PDF files are cached for 1 year.

## Deployment Notes
- Do not modify `_headers` unless you understand Cloudflare Headers syntax.
- The `dist/` directory is generated; never edit it manually.
- Worker script is output to `dist/_worker.js/`. It is excluded from static assets via `.assetsignore`.
