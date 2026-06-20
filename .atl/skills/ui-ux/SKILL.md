---
name: ui-ux
description: "Trigger: UI, UX, user interface, experience, design, layout, responsive, accessibility. UX patterns and component usage for frailes_radio_lifra."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## Activation Contract

Use this skill when building user-facing layouts, forms, feedback states, animations, or anything affecting responsiveness and accessibility.

## Hard Rules

- Mobile-first: start from small breakpoints, add `md:`/`lg:` upward. Never desktop-first.
- Build with shadcn/ui primitives from `src/components/ui/` for visual consistency.
- Animations via Framer Motion, kept subtle and purposeful (no gratuitous motion on every element).
- Icons from `lucide-react` only. Never use emojis in UI.
- Toast notifications via `Sonner` (`src/components/ui/sonner.tsx`) — call `toast.*` for success/error feedback.
- Loading states via `Skeleton` (`src/components/ui/skeleton.tsx`); never block the UI without a fallback.
- Accessibility: Radix primitives provide a11y by default; add `aria-label`/`aria-*` only for custom non-Radix controls. Form fields must have visible or `sr-only` labels.
- Validate forms with inline feedback near the field; never alert/prompt for errors.

## Decision Gates

| Situation | Action |
|-----------|--------|
| Need a toast | Use `sonner` toast helpers |
| Async data loading | Render `Skeleton` placeholder until resolved |
| Form submission | Disable button + show inline validation feedback |
| Interactive animation | Framer Motion, short duration, ease-out |
| Responsive layout | Mobile-first utilities, stack → row with `md:` |
| Custom control (non-Radix) | Add explicit ARIA labels & roles |

## Execution Steps

1. Define the layout mobile-first using shadcn/ui primitives.
2. Add loading fallback (`Skeleton`) for any async state.
3. Wire feedback via `Sonner` toasts for user actions (save/delete/error).
4. Add Framer Motion animation only where it aids understanding.
5. Audit labels and ARIA: every interactive element reachable and named.
6. Verify dark mode renders correctly (`.dark` overrides).

## Output Contract

Responsive, accessible UI using shadcn/ui primitives, Sonner toasts for feedback, Skeleton for loading, Lucide icons (no emojis), and subtle Framer Motion — all mobile-first and dark-mode compatible.

## References

- `src/components/ui/sonner.tsx` — toast integration
- `src/components/ui/skeleton.tsx` — loading placeholders
- `src/components/ui/dialog.tsx` / `sheet.tsx` — overlay patterns
- `src/app/radioLifra/noticias/agregarNoticia/page.tsx` — form + feedback example