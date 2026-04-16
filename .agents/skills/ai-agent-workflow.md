# AI Agent Workflow Skill

## Core Principle
This project is maintained exclusively by AI agents. Humans provide high-level instructions only.

## File Management Rules
- **Single source of truth** for agent files is at the project root:
  - `.claudeignore` (symlinked by `.geminiignore`, `.kimiignore`)
  - `.agents/skills/` (symlinked by `.claude/skills/`, `.kimi/skills/`)
  - `.mcp.json` (symlinked by `.kimi/mcp.json`)
- Always edit the root source file, never the symlink.
- If you create a new agent-specific file, prefer placing it under `.agents/` or the root, then symlink it if needed.

## Before Making Changes
1. Read `README.md` and `architecture.md` for context.
2. Check existing code style in related files.
3. Prefer minimal, focused changes.

## After Making Changes
1. Run `npm run generate-data` if PDFs changed.
2. Run `npm run build` to verify the site compiles.
3. Do not commit or push unless explicitly asked.
