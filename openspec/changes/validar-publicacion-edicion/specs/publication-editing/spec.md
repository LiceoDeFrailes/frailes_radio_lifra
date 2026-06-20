# Spec: Publication Editing in Validation

## Purpose

Allow admins to edit pending publication fields directly during validation review,
then save (keep pending) or save+approve in a single action. This spec covers the
`publication-editing` capability: dialogs, per-type edit forms, Firestore updates,
preview rendering, and dual-action workflow.

## Requirements

### Functional

| ID | Requirement | Priority |
|----|-------------|----------|
| FR1 | Admin MUST be able to open an edit dialog from any pending publication card via a Pencil icon button | P0 |
| FR2 | Noticia dialog MUST allow editing title, description, content (TipTap), imageUrl (text input) | P0 |
| FR3 | Video dialog MUST allow editing title, description, url | P0 |
| FR4 | Galeria dialog MUST allow editing title, description | P0 |
| FR5 | Podcast dialog MUST allow editing title, description, url | P0 |
| FR6 | Each dialog SHALL show a read-only preview of current content before editing | P1 |
| FR7 | "Guardar Cambios" button MUST persist edits and keep `state: "pendiente"` | P0 |
| FR8 | "Guardar y Aprobar" button MUST persist edits and set `state: "aprobado"` | P0 |
| FR9 | Cancel/close MUST discard all unsaved edits without Firestore writes | P0 |
| FR10 | Title field MUST be validated as non-empty before save; error shown inline if empty | P0 |
| FR11 | Save operations SHALL show Spinner + disable buttons while in-flight | P0 |
| FR12 | On success, dialog SHALL close and parent card SHALL hide (setVisible false) | P0 |
| FR13 | On failure, error toast SHALL appear; dialog stays open for retry | P0 |

### Non-Functional

| ID | Requirement |
|----|-------------|
| NFR1 | All mutations MUST surface success/error via Sonner toasts |
| NFR2 | Dialog open/close animations MUST use Radix Dialog transitions (matching Sheet pattern) |
| NFR3 | Dialog layout MUST be responsive: stack vertically on mobile, center with max-width on desktop |
| NFR4 | Noticia content preview SHALL render TipTap HTML via `dangerouslySetInnerHTML` with sanitization |
| NFR5 | Video/Podcast preview SHALL lazy-load iframe `src` only when dialog opens |

### Auth

- Dialog is only reachable from the validation page, which already guards via `useAuth().user.role === "admin"` + redirect
- Edit dialogs SHALL NOT add a redundant auth check (parent page handles it)

## Data Model

### TypeScript Interfaces (`types/index.ts`)

```ts
interface UpdateNoticiaFields {
  title?: string
  description?: string
  content?: string
  imageUrl?: string
}

interface UpdateVideoFields {
  title?: string
  description?: string
  url?: string
}

interface UpdateGaleriaFields {
  title?: string
  description?: string
}

interface UpdatePodcastFields {
  title?: string
  description?: string
  url?: string
}
```

### Validation Rules

| Field | Rule |
|-------|------|
| `title` (all types) | MUST be non-empty, trimmed, max 200 chars |
| `description` (all types) | MAY be empty, max 2000 chars |
| `content` (noticias) | MAY be empty (TipTap generates minimal HTML even if blank) |
| `imageUrl` (noticias) | If non-empty, MUST start with `http://` or `https://`; max 2000 chars |
| `url` (videos, podcasts) | MUST be non-empty, MUST start with `http://` or `https://`; max 2000 chars |

### Firestore Document Shapes (unchanged, updated in-place)

```
noticias/{id}  → { title, description, content, imageUrl, state, ... }
videos/{id}    → { title, description, url, state, ... }
galerias/{id}  → { title, description, imageUrls, state, ... }
podcasts/{id}  → { title, description, url, state, ... }
```

## Actions (`src/lib/actions/general.actions.ts`)

| Function | Signature | Description |
|----------|-----------|-------------|
| `updateNoticia` | `(id: string, data: UpdateNoticiaFields, approve?: boolean) => Promise<{ok, error?}>` | `updateDoc` noticias/{id}; if approve, also sets `state: "aprobado"` |
| `updateVideo` | `(id: string, data: UpdateVideoFields, approve?: boolean) => Promise<{ok, error?}>` | Same pattern for videos |
| `updateGaleria` | `(id: string, data: UpdateGaleriaFields, approve?: boolean) => Promise<{ok, error?}>` | Same pattern for galerias |
| `updatePodcast` | `(id: string, data: UpdatePodcastFields, approve?: boolean) => Promise<{ok, error?}>` | Same pattern for podcasts |

**Error handling**: All return `{ ok: boolean, error?: any }`. Callers handle toast.
Network errors bubble; Firestore write failures return `ok: false`.

## UI Specification

### Dialog Wrapper (`src/components/ui/dialog.tsx`)

New shadcn/ui component following the `sheet.tsx` pattern using `@radix-ui/react-dialog`:
- `Dialog`, `DialogTrigger`, `DialogPortal`, `DialogOverlay`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `DialogClose`
- `DialogContent`: centered modal, `max-w-2xl`, `rounded-lg`, `bg-background`, `p-6`, `shadow-lg`, overlay fade-in/out
- Close button (XIcon) in top-right

### Per-Type Dialogs

All dialogs share: `open` prop (boolean), `onOpenChange` prop, `item` prop (the publication data), `onSaved` callback (fires after successful save to hide card).

| Dialog | Editable Fields | Preview |
|--------|----------------|---------|
| `NoticiaEditDialog` | title (Input), description (Textarea), content (TipTap Editor), imageUrl (Input) | HTML-rendered content section, Image preview for current imageUrl |
| `VideoEditDialog` | title (Input), description (Textarea), url (Input) | `iframe` embed of current URL |
| `GaleriaEditDialog` | title (Input), description (Textarea) | Carousel of current images (read-only) |
| `PodcastEditDialog` | title (Input), description (Textarea), url (Input) | `iframe` embed of current URL |

### Form Layout (all dialogs)

```
DialogContent (max-w-2xl, max-h-[90vh] overflow-y-auto)
├── DialogHeader: DialogTitle "Editar {tipo}" + DialogDescription
├── Preview section: rendered content/image/iframe
├── Form fields: label + input/textarea/Editor, stacked, gap-4
└── DialogFooter: 3 buttons row
    ├── "Cancelar" (DialogClose, variant="outline")
    ├── "Guardar Cambios" (variant="secondary", saves)+ Spinner
    └── "Guardar y Aprobar" (variant="default", fills green) + Spinner
```

**Mobile**: `max-w-[95vw]`, full-width on small screens. Form fields stack vertically.
**Desktop**: `max-w-2xl`, centered, fields side-by-side where appropriate.

**Loading**: While saving, both action buttons show `Spinner` and are `disabled`. Cancel button remains enabled.

**Noticia dialog special case**: The TipTap `Editor` component takes `onChange` and receives initial content via `content` prop. The existing `Editor.tsx` must be updated to accept an optional `initialContent` prop.

## Component Architecture

```
src/components/ui/dialog.tsx              ← NEW (Radix Dialog wrapper, ~80 lines)
src/components/NoticiaEditDialog.tsx       ← NEW (~90 lines)
src/components/VideoEditDialog.tsx         ← NEW (~55 lines)
src/components/GaleriaEditDialog.tsx       ← NEW (~50 lines)
src/components/PodcastEditDialog.tsx       ← NEW (~55 lines)
src/components/NoticiaCard.tsx             ← MODIFIED: add Pencil button, dialog state
src/components/VideoCard.tsx               ← MODIFIED: add Pencil button, dialog state
src/components/GaleriaCard.tsx             ← MODIFIED: add Pencil button, dialog state
src/components/PodcastCard.tsx             ← MODIFIED: add Pencil button, dialog state
src/components/Editor.tsx                  ← MODIFIED: accept optional `initialContent` prop
```

### Props Interfaces

```ts
// Shared across all edit dialogs
interface EditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: PublicacionBase  // the publication to edit
  onSaved: () => void     // callback to hide parent card
}
```

### State Management
- Each Card component owns: `dialogOpen` (boolean, `useState(false)`)
- Pencil button → `setDialogOpen(true)`
- Dialog `onSaved` → `setDialogOpen(false)` + `setVisible(false)`
- Dialog internal state: local form fields initialized from `item` on mount via `useState(item.field)`

## Scenarios

### SC1: Admin opens noticia edit dialog
- **GIVEN** admin is on validation page with a pending noticia card
- **WHEN** admin clicks the Pencil icon on the card
- **THEN** NoticiaEditDialog opens with pre-populated fields (title, description, content in TipTap, imageUrl)
- **AND** preview section shows current image and rendered HTML content

### SC2: Admin edits title and saves (stays pending)
- **GIVEN** NoticiaEditDialog is open with title "Evento Escolar"
- **WHEN** admin changes title to "Feria de Ciencias 2026" and clicks "Guardar Cambios"
- **THEN** `updateNoticia(id, {title: "Feria de Ciencias 2026"}, false)` is called
- **AND** Firestore `noticias/{id}.title` is updated, `state` remains "pendiente"
- **AND** toast "Cambios guardados" appears, dialog closes, card hides

### SC3: Admin edits content and approves
- **GIVEN** noticia edit dialog open with minor typo in content
- **WHEN** admin fixes the typo via TipTap and clicks "Guardar y Aprobar"
- **THEN** `updateNoticia(id, {content: "..."}, true)` is called
- **AND** Firestore `noticias/{id}.content` is updated AND `state` set to "aprobado"
- **AND** toast "Publicación aprobada" appears, dialog closes, card hides

### SC4: Admin cancels without saving
- **GIVEN** Admin has modified the title field in the edit dialog
- **WHEN** Admin clicks "Cancelar" or the X close button
- **THEN** Dialog closes, no Firestore write occurs, card remains visible with original data

### SC5: Validation blocks empty title
- **GIVEN** Admin clears the title field
- **WHEN** Admin clicks "Guardar Cambios" or "Guardar y Aprobar"
- **THEN** Inline error "El título es obligatorio" appears below the title field
- **AND** Save does NOT proceed (client-side validation blocks)

### SC6: Network error during save
- **GIVEN** Admin edits a video and clicks "Guardar Cambios"
- **WHEN** `updateVideo` fails with network error (returns `ok: false`)
- **THEN** toast "Error al guardar los cambios" appears, dialog stays open, buttons re-enabled

### SC7: Admin edits video URL
- **GIVEN** VideoEditDialog is open showing an iframe preview of the current URL
- **WHEN** Admin pastes a new YouTube URL and clicks "Guardar y Aprobar"
- **THEN** `updateVideo(id, {url: "..."}, true)` called, Firestore updated, state → aprobado

### SC8: Admin edits galeria description
- **GIVEN** GaleriaEditDialog open with carousel preview of images
- **WHEN** Admin edits description and clicks "Guardar Cambios"
- **THEN** `updateGaleria(id, {description: "..."}, false)` called, state stays pending

## Security

| Concern | Mitigation |
|---------|------------|
| XSS via TipTap HTML preview | `dangerouslySetInnerHTML` is necessary for TipTap; server-side DOMPurify sanitization on read path (add to `ContentDetailCard` and preview) |
| Unauthorized edits | Auth guard on parent validation page; dialogs only mount when `validationMode=true` |
| URL injection in imageUrl | Client validates `http(s)://` prefix; next/image only loads allowed domains |
| Nested dialog z-index | Radix Dialog Portal renders in body with `z-50`; TipTap uses `EditorContent` which respects parent stacking |

## Test Coverage

No test runner configured. If one were added:

| Scenario | Test Approach |
|----------|---------------|
| SC2 (save pending) | Mock `updateDoc`, verify called without `state: "aprobado"` |
| SC3 (save+approve) | Mock `updateDoc`, verify called WITH `state: "aprobado"` |
| SC5 (empty title) | Component: render dialog, clear input, click save, assert error message visible |
| SC6 (network error) | Mock `updateDoc` to reject, assert toast error + dialog still open |
| SC1 (open dialog) | Component: render card, click Pencil, assert dialog content matches `item` fields |
