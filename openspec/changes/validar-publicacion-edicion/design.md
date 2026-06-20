# Design: Edición en Validación de Publicaciones

## Technical Approach

Add inline edit capability to the 4 pending publication card types via Radix Dialog modals. Each type gets a dedicated dialog component with form fields matching its schema. The TipTap editor accepts initial content for noticias. Two save actions: "Guardar" (keeps pending) and "Guardar + Aprobar" (updates and sets `state = aprobado`). Cards remain self-contained: they own dialog open state and visibility.

## Architecture Decisions

| Decision | Options | Tradeoffs | Choice |
|---|---|---|---|
| Dialog primitive | Custom div vs Radix Dialog | Radix gives a11y, focus trap, Portal for z-index | Radix Dialog (matches `sheet.tsx`) |
| State ownership | Lifted to parent vs Card-local | Lifted requires prop drilling; local keeps cards self-contained | Card-local for `open`/`visible`; dialog-local for form |
| Editor init | Controlled `content` prop vs `setContent` effect | TipTap `content` only works on mount; effect allows dynamic init | Add `initialContent` prop + `useEffect` calling `editor.commands.setContent()` |
| Save transaction | Single `updateDoc` vs batched write | No cross-collection consistency needed; single doc update is atomic | Single `updateDoc` per type with optional `state` merge |
| Card type fix | Rename `VideoCard` export vs leave as-is | `VideoCard` currently exports `NoticiaCard` — fixing is 1 line, reduces confusion | Fix export name during modification |

## Data Flow

```
Card (owns open, visible)
  └─ DialogTrigger (Pencil button)
      └─ Dialog (form state local)
          ├─ Form fields → local useState
          ├─ Preview pane (read-only HTML / iframe / carousel)
          └─ Actions
               ├─ Guardar → updateX(id, data) → toast success
               └─ Guardar+Aprobar → updateX(id, data, approve=true) → setVisible(false)
```

Cards receive no new parent callbacks. On approve, `setVisible(false)` removes the card from the list as today.

## File Changes

| File | Action | Description |
|---|---|---|
| `src/components/ui/dialog.tsx` | Create | shadcn/ui Dialog wrapper following `sheet.tsx` pattern (Radix primitives, `data-slot`, CSS animations) |
| `src/components/EditNoticiaDialog.tsx` | Create | Dialog with title, description, imageUrl inputs; TipTap editor; HTML preview toggle |
| `src/components/EditVideoDialog.tsx` | Create | Dialog with title, description, url inputs; iframe preview |
| `src/components/EditGaleriaDialog.tsx` | Create | Dialog with title, description inputs; read-only carousel preview |
| `src/components/EditPodcastDialog.tsx` | Create | Dialog with title, description, url inputs; iframe preview |
| `src/components/NoticiaCard.tsx` | Modify | Add Pencil button (when `validationMode`), import `EditNoticiaDialog`, wire `open` state |
| `src/components/VideoCard.tsx` | Modify | Add Pencil button, import `EditVideoDialog`, fix export name to `VideoCard` |
| `src/components/GaleriaCard.tsx` | Modify | Add Pencil button, import `EditGaleriaDialog` |
| `src/components/PodcastCard.tsx` | Modify | Add Pencil button, import `EditPodcastDialog` |
| `src/components/Editor.tsx` | Modify | Add optional `initialContent` prop; `useEffect` to populate editor when ready |
| `src/lib/actions/general.actions.ts` | Modify | Add `updateNoticia`, `updateVideo`, `updateGaleria`, `updatePodcast` |
| `types/index.ts` | Modify | Add update param types and dialog props interfaces |

## Interfaces

```typescript
// types/index.ts
interface UpdateNoticiaParams {
  id: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  approve?: boolean;
}

interface UpdateVideoParams {
  id: string;
  title: string;
  description: string;
  url: string;
  approve?: boolean;
}

interface UpdateGaleriaParams {
  id: string;
  title: string;
  description: string;
  approve?: boolean;
}

interface UpdatePodcastParams {
  id: string;
  title: string;
  description: string;
  url: string;
  approve?: boolean;
}

interface EditNoticiaDialogProps {
  item: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

// Editor.tsx
interface EditorProps {
  onChange: (html: string) => void;
  reset?: boolean;
  initialContent?: string;
}
```

## Dialog State Machine

| State | Triggers | Actions |
|---|---|---|
| `closed` | Pencil click | Reset form state to `item` values; set `open = true` |
| `open(editing)` | — | Render form fields + preview toggle |
| `saving` | Guardar / Guardar+Aprobar click | Disable buttons; show spinner toast; call action |
| `closed` | Action success | `onOpenChange(false)`; if approved, `onSaved()` triggers `setVisible(false)` |
| `open(editing)` | Action failure | Re-enable buttons; toast error |

No separate `preview` state; preview is a toggle within `open`.

## TipTap Editor Modification

In `Editor.tsx`:
- Add `initialContent?: string` to props.
- After `useEditor` returns (not null), run:
  ```typescript
  useEffect(() => {
    if (editor && initialContent !== undefined) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);
  ```
- Do **not** pass `initialContent` into `useEditor({ content: ... })` because the editor instance may be recreated; `setContent` is safer for dialogs that mount/unmount.
- Existing create pages pass no `initialContent`; behavior unchanged.

## Firestore Operations

```typescript
export async function updateNoticia(params: UpdateNoticiaParams) {
  const { id, title, description, content, imageUrl, approve } = params;
  const ref = doc(db, "noticias", id);
  const payload: any = { title, description, content, imageUrl };
  if (approve) payload.state = "aprobado";
  await updateDoc(ref, payload);
  return { ok: true };
}
```
Same pattern for `updateVideo`, `updateGaleria`, `updatePodcast`.

- No transaction needed: single-document update.
- On failure, return `{ ok: false, error }` and let the dialog toast.

## Sequence Diagrams

**Open and edit (save only)**
```
Admin → Card: click Pencil
Card → Dialog: setOpen(true)
Dialog → Editor: mount with initialContent
Admin → Dialog: edit fields
Admin → Dialog: click "Guardar"
Dialog → Action: updateX(id, data, approve=false)
Action → Firestore: updateDoc
Action → Dialog: { ok: true }
Dialog → Toast: success
Dialog → Card: onOpenChange(false)
```

**Edit and approve**
```
Admin → Dialog: click "Guardar + Aprobar"
Dialog → Action: updateX(id, data, approve=true)
Action → Firestore: updateDoc with state="aprobado"
Action → Dialog: { ok: true }
Dialog → Card: onSaved() → setVisible(false)
Dialog → Toast: success
```

**Cancel**
```
Admin → Dialog: click X or overlay
Dialog → Card: onOpenChange(false)
Form state discarded on next open (reset from item)
```

## Edge Cases

| Case | Handling |
|---|---|
| Network failure | Action returns `{ ok: false }`; dialog stays open; toast error; buttons re-enabled |
| Concurrent edit | Last write wins (Firestore behavior); acceptable for this admin-only flow |
| Empty title | Client validation: disable save buttons if `title.trim() === ""`; show inline error |
| Empty TipTap content | Allow empty string; `initialContent` can be `""`; `setContent("")` works |
| Invalid URL | No URL validation in v1; admin responsibility |
| Dialog close while saving | Radix Dialog prevents interaction with overlay while buttons are disabled |
| Mobile viewport | Dialog uses `sm:max-w-lg` and scrollable content; buttons stack vertically |
| TipTap z-index inside Dialog | Radix Dialog.Portal ensures dialog overlays everything; TipTap toolbar stays inside dialog content |

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Unit | Dialog form validation (empty title) | Render dialog, click save, assert button disabled |
| Integration | Save keeps pending; Save+Approve removes card | Mock `updateNoticia`, trigger actions, assert toast + visibility |
| E2E | Full flow: open dialog, edit, save, card gone | Cypress/Playwright on validation page |

## Migration / Rollout

No migration required. Firestore schema unchanged.

## Open Questions

- None. Design is ready for implementation.
