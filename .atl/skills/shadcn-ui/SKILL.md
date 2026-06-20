---
name: shadcn-ui
description: "Trigger: shadcn, component, Button, Card, Dialog, UI component, radix. shadcn/ui component conventions for frailes_radio_lifra."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## Activation Contract

Use this skill when creating, editing, or adding components under `src/components/ui/`, or when importing a shadcn/ui primitive into a feature component.

## Hard Rules

- UI primitives live in `src/components/ui/`. Feature/domain components go elsewhere (e.g. `src/components/<feature>/`).
- Use CVA (`class-variance-authority`) for variant definitions and `VariantProps<typeof X>` for typing.
- Merge classes with `cn()` from `@/lib/utils`. Never hand-concatenate conditional classNames.
- Base interactivity on Radix UI primitives (`@radix-ui/react-*`); do not invent custom focus/keyboard behavior.
- Icons: import from `lucide-react` only. Never inline SVGs when a Lucide icon exists.
- Add `data-slot="<name>"` on the root element for component identification (see `button.tsx`).
- Use `@radix-ui/react-slot`'s `Slot` when supporting an `asChild` prop.

## Decision Gates

| Situation | Action |
|-----------|--------|
| New shared UI primitive | Add `src/components/ui/<name>.tsx` following `button.tsx` |
| Need a named variant set | Define with `cva` and export `*Variants` |
| Override styles on a primitive | Pass `className` merged via `cn()` |
| Want a custom popover/dialog | Wrap the matching Radix primitive; don't rebuild a11y |
| Icon needed | Use Lucide React; never emoji in UI |

## Execution Steps

1. Check `src/components/ui/` for an existing primitive before creating a new one.
2. Model the new component on `src/components/ui/button.tsx`: function component (no forwardRef unless existing pattern), `cva` variant block, `data-slot`, `asChild` via `Slot`.
3. Use `React.ComponentProps<"tag">` for base props plus `VariantProps`.
4. Apply `cn(variantFn({ variant, size, className }))` on the root.
5. Export both the component and its `*Variants` helper.
6. Add `'use client'` only if the component uses hooks/event handlers (stateless presentational primitives may stay server-safe).

## Output Contract

A `src/components/ui/<name>.tsx` file using CVA variants, `cn()`, Radix primitives, Lucide icons, and the `button.tsx` structural pattern — exported with its variant helper.

## References

- `src/components/ui/button.tsx` — canonical component pattern
- `src/components/ui/card.tsx` — compound component pattern
- `src/components/ui/sonner.tsx` — toast wrapper
- `src/lib/utils.ts` — `cn()` implementation