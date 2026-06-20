# Tasks: Admin Configuración Colegio

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~380–420 |
| 400-line budget risk | Medium |
| Chained PRs recommended | No |
| Suggested split | Single PR (tight but achievable) |
| Delivery strategy | ask-always |
| Chain strategy | pending |

Decision needed before apply: Yes
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Types + actions + admin page | PR 1 | Foundation + core feature |
| 2 | Public page wiring + nav | PR 2 | Consumer changes, depends on PR 1 actions |

## Phase 1: Foundation / Types & Actions

- [x] 1.1 Create `src/types/index.ts` with `Stat`, `TeamMember`, `ContactMethod`, `StatsDoc`, `EquipoDoc`, `ContactoDoc` interfaces (~25 lines)
- [x] 1.2 Create `src/lib/actions/configuracion.actions.ts` with `getConfigStats`, `getConfigEquipo`, `getConfigContacto` read functions using `getDoc` + hardcoded defaults (~45 lines)
- [x] 1.3 Add `saveConfigStats`, `saveConfigContacto` write functions using `setDoc` with `{ ok, error }` return pattern (~25 lines)
- [x] 1.4 Add `saveConfigEquipo` with optional `File` upload to `equipo/foto-grupal.jpg` via `uploadBytes` + `getDownloadURL` before `setDoc` (~35 lines)

## Phase 2: Admin Page

- [x] 2.1 Create `src/app/radioLifra/configuracion/page.tsx` as client component with `useAuth` guard — redirect non-admin to `/radioLifra` with toast (~20 lines)
- [x] 2.2 Build Stats section: collapsible card with 4 Input rows (number + label), "Guardar Estadísticas" button, Spinner + Sonner toast on save (~40 lines)
- [x] 2.3 Build Equipo section: dynamic member list (role/name/degree inputs), `+`/`Trash2` add/remove, file input for group photo with size validation (≤3MB, JPEG/PNG), preview thumbnail, "Guardar Equipo" button (~60 lines)
- [x] 2.4 Build Contacto section: dynamic method blocks with `<Select>` for Lucide icon (curated list: Phone, Mail, MapPin, Clock, Globe, Facebook, Instagram, Camera), title/content/description inputs, `+`/`Trash2`, "Guardar Contacto" button (~55 lines)

## Phase 3: Public Page Wiring

- [x] 3.1 Modify `src/app/page.tsx`: replace hardcoded `stats` array with `useEffect` calling `getConfigStats()`, add `Skeleton` loading state, fallback to current defaults (~20 lines changed)
- [x] 3.2 Modify `src/app/sobreNosotros/page.tsx`: replace hardcoded `team` with `useEffect` calling `getConfigEquipo()`, add `Skeleton` loading, render group photo below team grid via `next/image` (width=800, height=450, fallback to `/images/equipo-grupal.jpg`) (~30 lines changed)
- [x] 3.3 Modify `src/app/contacto/page.tsx`: replace hardcoded `contactInfo` with `useEffect` calling `getConfigContacto()`, add `Skeleton` loading, map icon string to Lucide component via lookup table with `HelpCircle` fallback (~25 lines changed)

## Phase 4: Navigation & Cleanup

- [x] 4.1 Modify `src/components/Layout/HeaderRadioLifra.tsx`: add `{ title: "Configuración", href: "/radioLifra/configuracion" }` to `gestionItems` array (admin-only dropdown) (~2 lines changed)
- [x] 4.2 Verify all sections save independently, toasts fire correctly, and public pages show data after admin saves (manual verification)
