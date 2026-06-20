# Design: Admin Configuración Colegio

## Technical Approach

Replace hardcoded stats, team, and contact data with Firestore-backed config documents. Build a single admin page with 3 collapsible sections. Public pages fetch config on mount with hardcoded fallback defaults. Follow existing patterns: client components, `useState`, modular Firestore SDK, shadcn/ui forms, Sonner toasts, and `useAuth` guard.

## Architecture Decisions

| Decision | Option A | Option B | Tradeoff | Choice |
|----------|----------|----------|----------|--------|
| Types location | `src/types/index.ts` | Inline in files | Central types enable reuse; project currently has no types dir | **A** — create `src/types/index.ts` |
| Admin nav placement | `navItems` (all users see link) | `gestionItems` (admin-only dropdown) | Spec says navItems, but existing pattern puts admin links in Gestión dropdown | **B** — add to `gestionItems` for consistency |
| State per section | One big state object | Independent state per section | Independent reduces re-renders and matches independent save buttons | **B** — separate `useState` per section |
| Image upload timing | Upload on file select | Upload on form submit | Upload-on-submit is simpler, matches noticias pattern, avoids orphaned files | **B** — upload with save button |
| Concurrent edits | Optimistic locking | Last-write-wins | Low-frequency config edits; proposal accepts last-write-wins | **B** — last-write-wins via `setDoc` |

## Data Flow

### Admin → Firestore

```
Admin form input → local useState → validation → saveConfigXxx() → setDoc() → toast feedback
                          ↓
                    [file?] → uploadBytes(storage, ref) → getDownloadURL() → include in setDoc data
```

### Firestore → Public Pages

```
Public page mount → useEffect → getConfigXxx() → getDoc() → setState → render
                          ↓
                    doc missing? → use hardcoded default array
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/types/index.ts` | Create | `TeamMember`, `ContactMethod`, `Stat`, `EquipoDoc`, `ContactoDoc`, `StatsDoc` interfaces |
| `src/lib/actions/configuracion.actions.ts` | Create | `getConfigStats`, `getConfigEquipo`, `getConfigContacto`, `saveConfigStats`, `saveConfigEquipo`, `saveConfigContacto` |
| `src/app/radioLifra/configuracion/page.tsx` | Create | Admin config page with 3 collapsible sections (client component) |
| `src/components/Layout/HeaderRadioLifra.tsx` | Modify | Add "Configuración" to `gestionItems` array |
| `src/app/page.tsx` | Modify | Replace hardcoded `stats` with `useEffect` + `getConfigStats()` + fallback defaults |
| `src/app/sobreNosotros/page.tsx` | Modify | Replace hardcoded `team` with `useEffect` + `getConfigEquipo()`; render group photo below team grid |
| `src/app/contacto/page.tsx` | Modify | Replace hardcoded `contactInfo` with `useEffect` + `getConfigContacto()` + fallback defaults |

## Interfaces / Contracts

```ts
// src/types/index.ts
export interface Stat {
  number: string;
  label: string;
}

export interface TeamMember {
  role: string;
  name: string;
  degree: string;
}

export interface ContactMethod {
  icon: string;
  title: string;
  content: string;
  description: string;
}

export interface StatsDoc {
  items: Stat[];
}

export interface EquipoDoc {
  fotoGrupalUrl: string;
  miembros: TeamMember[];
}

export interface ContactoDoc {
  metodos: ContactMethod[];
}
```

## Firestore Operations

### Reads (all public pages + admin page load)

```ts
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase/client";

export async function getConfigStats(): Promise<Stat[]> {
  const snap = await getDoc(doc(db, "configuracion", "stats"));
  if (!snap.exists()) return DEFAULT_STATS;
  return (snap.data() as StatsDoc).items;
}
```

Same pattern for `getConfigEquipo` and `getConfigContacto`. Return hardcoded defaults when `!snap.exists()`.

### Writes (admin page)

```ts
import { doc, setDoc } from "firebase/firestore";

export async function saveConfigStats(items: Stat[]) {
  try {
    await setDoc(doc(db, "configuracion", "stats"), { items });
    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
}
```

`saveConfigEquipo` accepts optional `File`. If provided, uploads to `equipo/foto-grupal.jpg`, gets URL, then writes doc with `fotoGrupalUrl`.

## Image Upload Flow

1. Admin selects file in equipo section → `onChange` validates size ≤ 3MB and type (JPEG/PNG)
2. File stored in local `useState<File | null>`
3. On "Guardar Equipo" click → `saveConfigEquipo(miembros, file)`
4. If `file` exists:
   - `ref(storage, "equipo/foto-grupal.jpg")`
   - `uploadBytes(ref, file)`
   - `getDownloadURL(ref)` → `fotoUrl`
5. `setDoc(doc(db, "configuracion", "equipo"), { fotoGrupalUrl: fotoUrl, miembros })`
6. Return `{ ok: true, fotoUrl }` to caller for preview update

## Form Validation

| Field | Rule | Feedback |
|-------|------|----------|
| `Stat.number` | non-empty, max 10 chars | `required` attr + manual check → toast |
| `Stat.label` | non-empty, max 40 chars | `required` attr + manual check → toast |
| `TeamMember.*` | non-empty, max per spec | Inline check before save → toast |
| `ContactMethod.icon` | non-empty, must be valid Lucide name | Validate against known icons or try dynamic import; toast if invalid |
| `ContactMethod.title` | non-empty, max 40 chars | Manual check → toast |
| Group photo | JPEG/PNG, max 3MB | `onChange` check → toast + clear input |

**Strategy**: Field-level via `required` and `maxLength` on inputs. Form-level validation runs on submit, returning early with `toast.warning("Complete todos los campos")` if any field is invalid.

## Sequence Diagrams

### Admin edits stats and saves

```
Admin → [ConfigPage] → clicks "Guardar Estadísticas"
[ConfigPage] → validates fields
[ConfigPage] → shows Spinner toast
[ConfigPage] → saveConfigStats(items)
saveConfigStats → setDoc(configuracion/stats)
saveConfigStats → returns { ok: true }
[ConfigPage] → dismiss Spinner → toast.success("Estadísticas guardadas")
```

### Admin uploads group photo

```
Admin → selects file → [ConfigPage] validates size/type → stores in state
Admin → clicks "Guardar Equipo"
[ConfigPage] → saveConfigEquipo(miembros, file)
saveConfigEquipo → uploadBytes(storage, equipo/foto-grupal.jpg)
saveConfigEquipo → getDownloadURL() → fotoUrl
saveConfigEquipo → setDoc(configuracion/equipo, { fotoGrupalUrl, miembros })
[ConfigPage] → updates preview with returned fotoUrl → toast success
```

### Public page loads data with fallback

```
User → loads /sobreNosotros
[SobreNosotrosPage] → useEffect → getConfigEquipo()
getConfigEquipo → getDoc(configuracion/equipo)
[doc exists] → return data → render team cards + group photo
[doc missing] → return DEFAULT_TEAM → render with defaults
```

## Edge Cases

| Case | Handling |
|------|----------|
| Empty Firestore doc (first load) | Read functions return hardcoded defaults matching current values |
| Network failure during save | Catch in action → return `{ ok: false, error }` → toast.error with generic message |
| Invalid icon name in contact method | Validate on submit. Since dynamic Lucide imports are tricky, store icon name as string. Public page renders via `<LucideIcon name={icon} />` pattern or a mapping component. If invalid, render a default `HelpCircle` icon silently. |
| Concurrent edits | Last-write-wins. `setDoc` overwrites entire doc. Acceptable per proposal. |
| Photo upload succeeds but Firestore write fails | Storage file exists but doc not updated. On next load, public page falls back to default image. Admin can retry save. |
| Non-admin accesses /radioLifra/configuracion | `useEffect` checks `user.role !== "admin"` → toast.info("Acceso denegado") → `router.push("/radioLifra")` |

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `getConfigStats` returns defaults on missing doc | Mock `getDoc` with `exists() === false`, assert default array returned |
| Unit | `saveConfigEquipo` uploads file + updates doc | Mock `uploadBytes`, `getDownloadURL`, `setDoc`; verify correct path and data |
| Component | Stats form blocks empty fields | Render page, submit with empty input, assert `toast.warning` called |
| Component | Non-admin redirect | Mock `useAuth` with student role, assert `router.push` called |
| Integration | End-to-end save + public page read | Save config in admin, navigate to public page, assert new data visible |

## Migration / Rollout

No data migration required. Firestore docs are created on first admin save. Public pages gracefully fall back to hardcoded defaults until docs exist. After deployment, an admin must visit `/radioLifra/configuracion` and save each section to populate Firestore.

## Open Questions

- [ ] Should the `icon` field in `ContactMethod` use a dropdown of known Lucide icons, or free text input? **Decision**: Use a `<Select>` dropdown populated with a curated list of 8–10 common icons (Phone, Mail, MapPin, Clock, etc.) to avoid invalid names.
- [ ] Should we delete the old group photo from Storage before uploading a new one? **Decision**: No — overwrite at fixed path `equipo/foto-grupal.jpg` reuses the same ref, so Firebase Storage replaces it automatically.
