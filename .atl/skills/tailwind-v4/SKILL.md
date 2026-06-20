---
name: tailwind-v4
description: "Trigger: Tailwind, CSS, styling, theme, color, className, @apply. Tailwind CSS v4 theming and styling rules for frailes_radio_lifra."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## Activation Contract

Use this skill when editing `globals.css`, adding theme tokens, applying brand colors, or choosing className utilities in components.

## Hard Rules

- Use Tailwind v4 syntax: `@import "tailwindcss";`. Never use v3 directives (`@tailwind base/components/utilities`).
- Define theme tokens in `@theme inline { ... }` (maps CSS vars to Tailwind tokens like `--color-background: var(--background)`).
- Color values use `oklch()` in `:root` and `.dark` (see `globals.css`).
- Custom brand colors go in a separate `@theme { --color-Dark-Green-Lifra: #4C811F; --color-Light-Green-Lifra: #A1D43B; }` block — usable as `bg-Dark-Green-Lifra`, `text-Light-Green-Lifra`.
- Prefer utility classes in JSX over `@apply`. Use `@apply` only inside `@layer base` for reset-level rules.
- Standard tokens: `border-border`, `bg-background`, `text-foreground`, `bg-primary`, `text-primary-foreground`, `bg-destructive`.
- Theme toggle via `.dark` class on an ancestor (dark mode is opt-in, light is default).

## Decision Gates

| Situation | Action |
|-----------|--------|
| Need a brand color | Use `Dark-Green-Lifra` / `Light-Green-Lifra` tokens |
| New theme color | Add `oklch()` vars in `:root` and `.dark`, map in `@theme inline` |
| Reset/base styling | `@layer base` + `@apply` (sparingly) |
| Component styles | Utility classes in JSX via `cn()`, not `@apply` |
| Dark-mode variant | Use `dark:` utilities; ensure `.dark` ancestor present |

## Execution Steps

1. Identify whether the change needs a new token or just utilities.
2. If token: add the CSS var in `:root` (and `.dark` if it differs) then map it in `@theme inline`.
3. For brand greens, reference `--color-Dark-Green-Lifra` / `--color-Light-Green-Lifra` already defined.
4. Apply styles as utility classes in JSX; use `cn()` to merge conditionally.
5. Verify light theme is the default and `.dark` overrides persist.

## Output Contract

Styling that uses Tailwind v4 `@import` + `@theme inline` syntax, `oklch()` tokens, brand color tokens where relevant, and utility-first classNames in JSX — with `@apply` confined to `@layer base`.

## References

- `src/app/globals.css` — `@import "tailwindcss"`, `@theme inline`, `:root`, `.dark`, brand `@theme` block
- `src/lib/utils.ts` — `cn()` helper