# Spec: Configuración Colegio (Admin)

## Purpose

Replace hardcoded school data on 3 public pages with a Firestore-backed admin
panel. Define data types, Firestore schema, API surface, UI behavior, and
public-page consumption contract for the `school-config` capability.

## Requirements

### Functional

| ID | Requirement | Priority |
|----|-------------|----------|
| FR1 | Admin MUST be able to edit 4 numeric stats (number + label) via inline form | P0 |
| FR2 | Admin MUST be able to add, edit, and delete team members (role, name, degree) | P0 |
| FR3 | Admin MUST be able to upload a SINGLE group photo for the entire team | P0 |
| FR4 | Admin MUST be able to add/remove contact methods dynamically (icon, title, content, description) | P0 |
| FR5 | Each section SHALL save independently to its Firestore doc on submit | P0 |
| FR6 | Group photo SHALL display BELOW the team members list on the about-us page | P1 |
| FR7 | Public pages SHALL read from Firestore with Skeleton fallback while loading | P0 |
| FR8 | Non-admin users SHALL be redirected from `/radioLifra/configuracion` | P0 |

### Non-Functional

| ID | Requirement |
|----|-------------|
| NFR1 | Save operations MUST complete within 3 seconds (optimistic response) |
| NFR2 | Image upload MUST honor 3 MB limit matching existing noticias pattern |
| NFR3 | Forms MUST show inline validation feedback per field |
| NFR4 | All mutations MUST surface success/error via Sonner toasts |
| NFR5 | Page layout MUST be mobile-first, stacked → side-by-side at `md:` |

### Auth

- Route `/radioLifra/configuracion` MUST check `useAuth().user.role === "admin"` on mount
- Non-admin or unauthenticated users MUST see toast "Acceso denegado" and redirect to `/radioLifra`

## Data Model

### TypeScript Interfaces (`types/index.ts`)

```ts
interface TeamMember {
  role: string    // REQUIRED, max 60 chars
  name: string    // REQUIRED, max 80 chars
  degree: string  // REQUIRED, max 60 chars
}

interface ContactMethod {
  icon: string    // REQUIRED, Lucide icon name (e.g. "Phone", "Mail")
  title: string   // REQUIRED, max 40 chars
  content: string // REQUIRED, max 120 chars
  description: string // OPTIONAL, max 80 chars
}

interface SaveConfigParams {
  section: "stats" | "equipo" | "contacto"
  data: StatsDoc | EquipoDoc | ContactoDoc
  file?: File  // only for equipo section group photo
}
```

### Firestore Document Shapes

```
configuracion/stats    → { items: [{ number: string, label: string }] }
configuracion/equipo   → { fotoGrupalUrl: string, miembros: TeamMember[] }
configuracion/contacto → { metodos: ContactMethod[] }
```

### Validation Rules

| Field | Rule |
|-------|------|
| `Stat.number` | non-empty string, max 10 chars |
| `Stat.label` | non-empty string, max 40 chars |
| `TeamMember.role` | non-empty, max 60 chars |
| `TeamMember.name` | non-empty, max 80 chars |
| `TeamMember.degree` | non-empty, max 60 chars |
| `ContactMethod.icon` | non-empty, must match a Lucide icon name |
| `ContactMethod.title` | non-empty, max 40 chars |
| `ContactMethod.content` | non-empty, max 120 chars |
| Group photo | JPEG/PNG only, max 3 MB |

## Actions (`src/lib/actions/configuracion.actions.ts`)

| Function | Signature | Description |
|----------|-----------|-------------|
| `getConfigStats` | `() => Promise<{items: Stat[]}>` | Read `configuracion/stats` doc |
| `getConfigEquipo` | `() => Promise<EquipoDoc>` | Read `configuracion/equipo` doc |
| `getConfigContacto` | `() => Promise<ContactoDoc>` | Read `configuracion/contacto` doc |
| `saveConfigStats` | `(items: Stat[]) => Promise<{ok, error?}>` | Write stats via `setDoc` |
| `saveConfigEquipo` | `(miembros: TeamMember[], file?: File) => Promise<{ok, error?, fotoUrl?}>` | Write team + optional photo upload to `equipo/foto-grupal.jpg` |
| `saveConfigContacto` | `(metodos: ContactMethod[]) => Promise<{ok, error?}>` | Write contact methods via `setDoc` |

**Error handling**: All functions return `{ ok: boolean, error?: any }`. Caller handles
toast feedback. Storage errors (quota, network) bubble up; Firestore errors
(write failure) return `ok: false`.

**Loading states**: Public pages render `Skeleton` during `useEffect` fetch.
Admin page shows `Spinner` overlay over the saving section.

## UI Specification

### Admin Page (`radioLifra/configuracion/page.tsx`)

- **Layout**: 3 collapsible sections (ChevronDown/ChevronUp toggle), each in a
  `bg-white shadow rounded-2xl p-6` Card
- **Stats section**: 4 `Input` rows (number + label), "Guardar Estadísticas"
  green button
- **Team section**: Dynamic list of `inputs` per member (role, name, degree).
  `+` button to add row, `Trash2` icon per row to delete. Below members: file
  input for group photo with preview thumbnail. "Guardar Equipo" button
- **Contact section**: Dynamic list of method blocks (icon select via Select
  component, title/content/description Inputs). `+` to add, `Trash2` to remove.
  "Guardar Contacto" button
- **Auth guard**: `useEffect` checks `user.role !== "admin"` → toast + redirect
- **Feedback**: Sonner toast on save success/error. Spinner during upload.
- **Nav**: Add `{ title: "Configuración", href: "/radioLifra/configuracion" }`
  to `navItems` in `HeaderRadioLifra.tsx`

### Public Page Changes

| Page | Fetch | Fallback |
|------|-------|----------|
| `page.tsx` (home) | `getConfigStats()` → pass to `StatsSection` | Hardcoded default stats |
| `sobreNosotros/page.tsx` | `getConfigEquipo()` → team cards + group photo | Hardcoded team; `fotoGrupalUrl` falls back to `/images/equipo-grupal.jpg` |
| `contacto/page.tsx` | `getConfigContacto()` → contact cards | Hardcoded contact methods |

Group photo renders BELOW the team grid in `sobreNosotros/page.tsx` using
`next/image` with `width={800} height={450} className="rounded-lg shadow-md mx-auto mt-12"`.
No `fill` prop — use explicit dimensions.

## Scenarios

### SC1: Admin edits stats and saves
- **GIVEN** admin is on config page with stats section open
- **WHEN** admin changes stat labels/numbers and clicks "Guardar Estadísticas"
- **THEN** Firestore `configuracion/stats` is updated, toast "Estadísticas guardadas" appears

### SC2: Admin adds a team member
- **GIVEN** admin opens equipo section with 3 existing members
- **WHEN** admin clicks `+`, fills role/name/degree, clicks "Guardar Equipo"
- **THEN** `configuracion/equipo.miembros` now has 4 entries

### SC3: Admin uploads group photo
- **GIVEN** admin selects a JPEG under 3 MB in the equipo section file input
- **WHEN** admin clicks "Guardar Equipo"
- **THEN** file uploads to `equipo/foto-grupal.jpg`, doc field `fotoGrupalUrl` updated, toast confirms

### SC4: Admin adds a contact method
- **GIVEN** admin opens contacto section with 4 methods
- **WHEN** admin clicks `+`, selects "Mail" icon, fills fields, saves
- **THEN** `configuracion/contacto.metodos` has 5 entries

### SC5: Public page loads with empty Firestore doc
- **GIVEN** `configuracion/stats` doc does not exist (first visit before admin seeds)
- **WHEN** user loads home page
- **THEN** home page shows hardcoded default stats (current values) with Skeleton during fetch

### SC6: Non-admin tries to access config page
- **GIVEN** logged-in user with role "estudiante"
- **WHEN** user navigates to `/radioLifra/configuracion`
- **THEN** toast "Acceso denegado" shows, user redirected to `/radioLifra`

### SC7: Photo exceeds size limit
- **GIVEN** admin selects a 5 MB PNG in the file input
- **WHEN** file is selected
- **THEN** toast "La imagen supera los 3 MB" shows, input is cleared

## Test Coverage

No test runner configured. If one were added (Vitest + React Testing Library):

| Scenario | Test |
|----------|------|
| `saveConfigStats` sets doc | Unit: mock `setDoc`, verify called with correct path/data |
| `getConfigStats` returns defaults on missing doc | Unit: mock `getDoc` to return `exists()===false` |
| Stats form validation blocks empty fields | Component: render form, submit without filling, assert toast |
| Non-admin redirect | Component: mock `useAuth` with student role, assert router.push called |
| Group photo upload + URL update | Integration: mock Storage `uploadBytes` + `getDownloadURL`, verify `setDoc` receives URL |
| Contact method add/remove in UI | Component: render contact section, click `+` N times, assert N+1 rows |
