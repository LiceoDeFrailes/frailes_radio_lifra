# Tasks: Edición en Validación de Publicaciones

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~520 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 (Foundation: ~190 lines) → PR 2 (UI: ~330 lines) |
| Delivery strategy | single-pr (size:exception) |
| Chain strategy | stacked-to-main |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Types, actions, Editor prop — no UI changes | PR 1 | Base branch: main; self-contained, testable via actions |
| 2 | Dialog wrapper + 4 edit dialogs + 4 cards | PR 2 | Base branch: PR 1 branch; depends on PR 1 types/actions |

## Phase 1: Foundation — Types, Actions, Editor

- [x] 1.1 Add update field interfaces to `types/index.ts`: `UpdateNoticiaFields`, `UpdateVideoFields`, `UpdateGaleriaFields`, `UpdatePodcastFields`, `EditDialogProps` (~40 lines)
- [x] 1.2 Add `updateNoticia(id, data, approve?)` to `src/lib/actions/general.actions.ts` using `updateDoc` (~15 lines)
- [x] 1.3 Add `updateVideo(id, data, approve?)` to `src/lib/actions/general.actions.ts` (~15 lines)
- [x] 1.4 Add `updateGaleria(id, data, approve?)` to `src/lib/actions/general.actions.ts` (~15 lines)
- [x] 1.5 Add `updatePodcast(id, data, approve?)` to `src/lib/actions/general.actions.ts` (~15 lines)
- [x] 1.6 Add `initialContent?: string` prop to `src/components/Editor.tsx` + `useEffect` calling `editor.commands.setContent()` (~10 lines)

## Phase 2: Dialog Wrapper

- [x] 2.1 Create `src/components/ui/dialog.tsx` following `sheet.tsx` pattern: `Dialog`, `DialogTrigger`, `DialogClose`, `DialogPortal`, `DialogOverlay`, `DialogContent` (centered, `max-w-2xl`), `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter` (~80 lines)

## Phase 3: Edit Dialogs

- [x] 3.1 Create `src/components/NoticiaEditDialog.tsx`: form with title input, description textarea, TipTap `Editor` (with `initialContent`), imageUrl input, HTML preview via `dangerouslySetInnerHTML`, "Guardar Cambios" + "Guardar y Aprobar" buttons, title validation, saving state with Spinner (~90 lines)
- [x] 3.2 Create `src/components/VideoEditDialog.tsx`: form with title input, description textarea, url input, iframe preview, dual save buttons, title validation (~55 lines)
- [x] 3.3 Create `src/components/GaleriaEditDialog.tsx`: form with title input, description textarea, read-only carousel preview of `item.imageUrls`, dual save buttons, title validation (~50 lines)
- [x] 3.4 Create `src/components/PodcastEditDialog.tsx`: form with title input, description textarea, url input, iframe preview, dual save buttons, title validation (~55 lines)

## Phase 4: Card Modifications

- [x] 4.1 Modify `src/components/NoticiaCard.tsx`: import `Pencil`, `EditNoticiaDialog`, `DialogTrigger`; add `dialogOpen` state; add Pencil button in validation mode beside Check button; wire `onSaved` → `setVisible(false)` (~20 lines)
- [x] 4.2 Modify `src/components/VideoCard.tsx`: same pattern as 4.1 with `EditVideoDialog`; **fix bug**: rename component function and export from `NoticiaCard` to `VideoCard` (~20 lines)
- [x] 4.3 Modify `src/components/GaleriaCard.tsx`: same pattern with `EditGaleriaDialog` (~20 lines)
- [x] 4.4 Modify `src/components/PodcastCard.tsx`: same pattern with `EditPodcastDialog` (~20 lines)

## Phase 5: Verification

- [ ] 5.1 Manual test: open each dialog from validation page, verify fields pre-populate from `item`
- [ ] 5.2 Manual test: "Guardar Cambios" persists edits, keeps `state: "pendiente"`, card hides
- [ ] 5.3 Manual test: "Guardar y Aprobar" persists edits, sets `state: "aprobado"`, card hides
- [ ] 5.4 Manual test: empty title blocks save with inline error "El título es obligatorio"
- [ ] 5.5 Manual test: cancel/close discards changes, no Firestore write
- [ ] 5.6 Verify `VideoCard` export name is correct (was `NoticiaCard`)
- [ ] 5.7 Verify `Editor.tsx` backward compatible: create pages still work without `initialContent`
