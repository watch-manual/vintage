# PDF Management Skill

## Overview
The `public/pdf/` directory contains ~615 vintage watch manual PDFs.

## Filename Patterns
| Pattern | Example | Result |
|---------|---------|--------|
| Single caliber | `7T32A.pdf` | `["7T32A"]` |
| Underscore separated | `2A22A_23A_29A_32A.pdf` | `["2A22A", "2A23A", "2A29A", "2A32A"]` |
| Hyphen separated | `7T32B_7T42B.pdf` | `["7T32B", "7T42B"]` |
| Series | `2A_series.pdf` | `["2Aシリーズ"]` |
| Part number | `7D48-pt1.pdf` | `["7D48-pt1"]` |

## Important Rules
- Do NOT rename PDFs directly unless you also update the parser logic in `scripts/generate-manifest.js`.
- After adding/removing PDFs, always run `npm run generate-data`.
- PDFs are served statically; do not import them into Astro components.
