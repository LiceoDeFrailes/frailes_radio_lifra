# Proposal: Admin Configuración Colegio

## Intent

Replace hardcoded school data on 3 public pages (home stats, about-us team, contact info) with a Firestore-backed admin panel under `/radioLifra/configuracion`. Currently all values are local arrays inside page components — impossible to update without a deploy.

## Scope

### In Scope
- Admin page at `/radioLifra/configuracion` with auth guard (admin-only)
- Edit home-page stats (4 numeric entries: number + label)
- Edit team members (role, name, academic degree)
- Upload and display a **group photo** of the entire staff below the "Nuestro Equipo Directivo" section (not per-member photos)
- Add/remove contact methods dynamically (icon, title, content, description)
- Public pages fetch data from Firestore instead of hardcoded arrays
- Spinner fallback while fetching, Sonner toasts for save feedback

### Out of Scope
- Feature cards (icon + title + description) on home page
- Mission/vision/values text on about-us page
- Contact page map or address section
- Per-member profile photos (only one group photo for the entire team)

## Capabilities

### New Capabilities
- `school-config`: Admin CRUD for school-wide config data (stats, team, contact info)

### Modified Capabilities
None — no existing specs.

## Approach

**Firestore Schema**: Single `configuracion` collection, one doc per section:
- `configuracion/stats` → `{ items: Stat[] }`
- `configuracion/equipo` → `{ fotoGrupalUrl: string, miembros: TeamMember[] }` (each member has role, name, degree; one group photo for the entire team)
- `configuracion/contacto` → `{ metodos: ContactMethod[] }` (icon, title, content, description)

Group photo: The default image lives at `public/images/equipo-grupal.jpg` (static asset in repo). Admin can replace it via upload to Firebase Storage (`equipo/foto-grupal.jpg`), which updates `configuracion/equipo.fotoGrupalUrl`. Public pages use the Storage URL if set, otherwise fall back to `/images/equipo-grupal.jpg`.

**Admin Page**: Single client component at `radioLifra/configuracion/page.tsx` with 3 collapsible sections, each an inline form following existing patterns (`bg-white shadow rounded-2xl p-6`, green submit button, Spinner + Sonner toasts). Auth guard via `useAuth()` — redirect non-admin.

**Public Pages**: Keep as client components. Replace hardcoded arrays with `useEffect` Firestore reads + Skeleton loading state. `StatsSection`, team cards, and contact cards continue to receive props — only data sources change.

**Types** (`types/index.ts`): Add `TeamMember`, `ContactMethod`, `SiteConfig` interfaces.

**Navigation**: Add "Configuración" to `navItems` in `HeaderRadioLifra.tsx` (admin-visible only).

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `types/index.ts` | Modified | Add TeamMember, ContactMethod, SiteConfig interfaces |
| `src/app/radioLifra/configuracion/page.tsx` | New | Admin config editor (client component) |
| `src/lib/actions/configuracion.actions.ts` | New | Firestore read/write for config docs |
| `src/app/page.tsx` | Modified | Fetch stats from Firestore, add loading state |
| `src/app/sobreNosotros/page.tsx` | Modified | Fetch team from Firestore, render group photo below team section |
| `src/app/contacto/page.tsx` | Modified | Fetch contact methods from Firestore |
| `src/components/Layout/HeaderRadioLifra.tsx` | Modified | Add navigation link |
| `firebase/client.ts` | None | No changes needed |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Public page fails if Firestore doc is missing (first load before admin creates data) | Medium | Provide defaults matching current hardcoded values as fallback |
| Group photo upload exceeds storage quota | Low | Reuse existing 3MB limit pattern from noticias form |
| Config doc concurrent edits (two admins) | Low | Last-write-wins acceptable for low-frequency config edits |

## Rollback Plan

1. Remove `radioLifra/configuracion` page and nav link
2. Revert public pages to hardcoded arrays (keep as git stash or tag)
3. Delete `configuracion/*` docs from Firestore (optional, no harm keeping)

## Dependencies

- None — uses existing Firebase project, Storage, and shadcn/ui components

## Success Criteria

- [ ] Admin can edit home stats and see changes reflected immediately on home page
- [ ] Admin can add/edit/delete team members
- [ ] Admin can upload a group photo for the entire team
- [ ] Admin can add/remove contact methods dynamically
- [ ] Non-admin users are redirected from config page
- [ ] Public pages show Spinner while loading, graceful fallback on error
