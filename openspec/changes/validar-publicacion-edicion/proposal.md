# Proposal: Edición en Validación de Publicaciones

## Intent

Admins can only approve/reject pending publications. Minor issues force rejection and author resubmission. Add edit capability so admins fix content directly during validation.

## Scope

### In Scope
- Dialog wrapper (`src/components/ui/dialog.tsx`) following existing shadcn/ui patterns
- Edit button (Pencil icon) on all 4 card types in validation mode
- Per-type dialogs: `EditNoticiaDialog` (TipTap + preview), `EditGaleriaDialog`, `EditVideoDialog`, `EditPodcastDialog`
- Editable fields per type: noticias (title, description, content, imageUrl); galerias (title, description); videos/podcasts (title, description, url)
- Content preview: HTML toggle (noticias), iframe (videos/podcasts), carousel read-only (galerias)
- Dual action: **Save** (keeps pending) or **Save + Approve** (saves + approves)
- Firestore `updateDoc` functions for all 4 collections
- Sonner toasts + Spinner during saves

### Out of Scope
- Image upload/replacement (Storage complexity — v2)
- Galeria image add/remove
- Author metadata editing
- Audit log

## Capabilities

### New Capabilities
- `publication-editing`: Admin edits pending publication fields before approval

### Modified Capabilities
None.

## Approach

**Dialog per type** — separate components (fields differ). Centered modal over Sheet for editorial focus.

Noticias reuse `Editor.tsx` (TipTap). Preview toggle renders HTML.

Update functions: `updateNoticia(id, data, approve?)` — `updateDoc` + optional `state: "aprobado"`. Same pattern for all 4 collections.

Cards manage `dialogOpen` state, call `setVisible(false)` on success.

## Affected Areas

| Area | Impact |
|------|--------|
| `src/components/ui/dialog.tsx` | New |
| `src/components/EditNoticiaDialog.tsx` | New |
| `src/components/EditGaleriaDialog.tsx` | New |
| `src/components/EditVideoDialog.tsx` | New |
| `src/components/EditPodcastDialog.tsx` | New |
| `src/components/NoticiaCard.tsx` | Modified |
| `src/components/VideoCard.tsx` | Modified |
| `src/components/GaleriaCard.tsx` | Modified |
| `src/components/PodcastCard.tsx` | Modified |
| `src/lib/actions/general.actions.ts` | Modified |
| `types/index.ts` | Modified |

**Est. lines**: ~420

## Risks

| Risk | L | Mitigation |
|------|---|------------|
| TipTap focus/z-index vs Radix Dialog | M | Dialog.Portal; test focus trap |
| Save+Approve with bad data | L | Client validation + confirmation toast |
| Heavy iframe re-render in dialogs | L | Lazy-load src on mount |
| Broken imageUrl from text field | L | `http` prefix check; next/image error boundary |

## Rollback Plan

1. Remove edit buttons from all 4 cards
2. Delete 5 new component files
3. Remove update functions and type additions
4. No Firestore migration needed

## Dependencies

- `@radix-ui/react-dialog` — already installed (used by Sheet)
- `@tiptap/react` — already installed, `Editor.tsx` exists

## Success Criteria

- [ ] Edit dialog opens from any pending card with pre-populated fields
- [ ] Noticia: TipTap editor + HTML preview toggle works
- [ ] Video/Podcast: embedded iframe preview of current URL
- [ ] Save keeps pending; Save+Approve sets aprobado and removes card
- [ ] Toasts confirm success; error toast on failure
- [ ] Required field validation before save
