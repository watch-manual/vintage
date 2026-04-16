# Architecture

## Overview
This is a static site built with Astro 5.x for hosting vintage watch manual PDFs.

> **AI Agent Only Development**: This project is maintained exclusively by AI agents. Human contributors provide instructions only. All agent-specific configurations are centralized at the project root and symlinked into tool-specific directories (`.claude/`, `.gemini/`, `.kimi/`).

## Tech Stack
- Astro 5.x (Static Site Generation)
- Tailwind CSS 3.x
- Pagefind (Search)
- Cloudflare Pages (Hosting)

## Directory Structure
- `src/`: Astro source code (components, layouts, pages, data)
- `public/pdf/`: PDF assets (615+ files, managed by scripts)
- `scripts/generate-manifest.js`: Generates `src/data/calibers.json` from PDF filenames
- `dist/`: Build output

## Data Flow
1. `scripts/generate-manifest.js` scans `public/pdf/`
2. Extracts caliber numbers from filenames
3. Categorizes into Quartz / Digital / Mechanical / Other
4. Outputs `src/data/calibers.json`
5. Astro pages consume `calibers.json` at build time
6. Pagefind indexes the built HTML for search

## Build Process
`npm run generate-data && npm run build`

## Agent File Conventions
- **Single source of truth**: `.claudeignore`, `.agents/skills/`, and `.mcp.json` live at the project root.
- **Symlinks**: `.geminiignore`, `.kimiignore`, `.claude/skills`, `.kimi/skills`, and `.kimi/mcp.json` are symlinks to the root files/directories.
- **Do not break symlinks**: If you need to edit an agent file, edit the root target, not the symlink.
