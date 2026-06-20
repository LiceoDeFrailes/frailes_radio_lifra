---
name: web-design
description: "Trigger: design, theme, brand, color, typography, spacing, visual. Brand identity and visual design tokens for frailes_radio_lifra."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## Activation Contract

Use this skill when defining brand colors, typography, spacing rhythm, or visual hierarchy — or when theming must stay consistent with the Liceo De Frailes identity.

## Hard Rules

- Brand colors: Dark Green Lifra `#4C811F` (`Dark-Green-Lifra`), Light Green Lifra `#A1D43B` (`Light-Green-Lifra`). Reference via Tailwind tokens, not raw hex in JSX.
- Primary font: Roboto (sans-serif) loaded via `next/font/google` in `src/app/layout.tsx`.
- Default theme is light; dark mode supported via `.dark` class and `oklch()` token overrides.
- Border-radius base: `--radius: 0.625rem`; derived `--radius-sm/md/lg/xl` via calc in `@theme inline`.
- Color palette uses `oklch()` for perceptually uniform transitions; new tokens must follow.
- Theming flows from CSS variables in `globals.css`; consume them as Tailwind tokens (`bg-background`, `text-primary`, etc.).
- Maintain clear visual hierarchy through spacing and weight, not color alone.

## Decision Gates

| Situation | Action |
|-----------|--------|
| Primary brand accent | `Dark-Green-Lifra` token |
| Secondary/highlight | `Light-Green-Lifra` token |
| New theme color | `oklch()` in `:root` + `.dark`, mapped in `@theme inline` |
| Text hierarchy | Weight/size/spacing; reserve color for emphasis only |
| Rounded corners | Use `--radius-*` scale, don't hardcode `rem` |

## Execution Steps

1. Identify whether the change is a token, color choice, or typography decision.
2. Use brand tokens (`Dark-Green-Lifra` / `Light-Green-Lifra`) for green accents; semantic tokens for the rest.
3. Set type via Roboto and Tailwind font-size/weight utilities.
4. Apply spacing using Tailwind's scale; radius via `--radius-*` tokens.
5. Verify both light and dark themes render with adequate contrast.

## Output Contract

Design decisions expressed as `globals.css` tokens and Tailwind utility classes — brand greens via `Dark-Green-Lifra`/`Light-Green-Lifra`, Roboto typography, `oklch()` palette, and `--radius`-based corners — consistent across light and dark themes.

## References

- `src/app/globals.css` — `@theme inline`, `:root`, `.dark`, brand `@theme` block
- `src/app/layout.tsx` — Roboto font via `next/font/google`
- `tailwind.config` / `postcss.config.mjs` — v4 build config