---
name: nextjs
description: "Trigger: Next.js, App Router, page, layout, API route, server component, client component. App Router conventions for frailes_radio_lifra (Next.js 15 + React 19)."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## Activation Contract

Use this skill when creating or editing any route, layout, page, or API handler under `src/app/`, or when deciding whether a component must be a Server or Client Component.

## Hard Rules

- Default to Server Components. Add `'use client'` ONLY when the file uses hooks (`useState`, `useEffect`), browser APIs, event handlers (`onClick`, `onChange`), or context providers.
- API routes go in `src/app/api/<route>/route.ts` as Route Handlers exporting named `GET`, `POST`, etc.
- Use `next/font/google` for fonts (see `src/app/layout.tsx` Roboto setup). Never load fonts via `<link>` stylesheets.
- Use `next/image` for all raster images; always provide `width`/`height` or `fill` with a sized parent.
- SEO via the Metadata API (`export const metadata` or `generateMetadata`) in layouts/pages — never inject `<meta>` manually.
- Preserve existing route groups: `(auth)` group separates auth flows; `radioLifra` segment holds all admin/content pages.

## Decision Gates

| Situation | Action |
|-----------|--------|
| Component needs `onClick`/`useState`/`useEffect` | Add `'use client'` at file top |
| Pure data fetch + render | Keep as Server Component |
| New backend endpoint | Create `src/app/api/<name>/route.ts` exporting named HTTP verbs |
| Font needed | Import from `next/font/google`, apply via `className` on `<html>` or layout |
| Error boundary | Add `error.tsx` (must be a client component) |
| 404 / not-found | Add `not-found.tsx`; loading state via `loading.tsx` |

## Execution Steps

1. Identify the target file under `src/app/` and its role (page/layout/route/error/loading).
2. Determine Server vs Client: any interactivity, hooks, or browser APIs → `'use client'`.
3. Create the file with the correct special filename (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `route.ts`).
4. Add `metadata` (static or `generateMetadata`) when the route is publicly indexable.
5. Wrap images in `next/image`; load any new font via `next/font/google`.
6. Verify the route resolves correctly within its existing group/segment structure.

## Output Contract

A valid App Router file with correct special filename, minimal `'use client'` usage, Metadata where needed, `next/image` for images, and `next/font` for fonts — matching existing page/layout conventions.

## References

- `src/app/layout.tsx` — root layout, Roboto font wiring
- `src/app/page.tsx` — home page (server component)
- `src/app/(auth)/iniciarSesion/layout.tsx` — route group layout
- `src/app/radioLifra/layout.tsx` — admin section layout