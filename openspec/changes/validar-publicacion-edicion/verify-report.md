# Verification Report: validar-publicacion-edicion

## Change
validar-publicacion-edicion — Edición en Validación de Publicaciones

## Mode
openspec (file-based)

## Verdict
**PASS WITH WARNINGS**

## Executive Summary
The implementation is functionally complete and TypeScript-compiles cleanly. All 4 edit dialogs are wired correctly, the `VideoCard` export bug is fixed, and the `Editor` backward compatibility is preserved. However, there are 5 warnings that should be addressed before merge: an XSS surface in the Noticia preview, a stale-editor state bug on dialog reopen, pre-existing `console.log` statements left in modified card files, an unused import, and missing server-side auth checks in the new update actions. No critical blockers were found.

---

## Completeness Table

| Phase | Task | Status | Evidence |
|---|---|---|---|
| 1.1 | Add update field interfaces to `types/index.ts` | ✅ Complete | `UpdateNoticiaFields`, `UpdateVideoFields`, `UpdateGaleriaFields`, `UpdatePodcastFields`, `EditDialogProps` all present. |
| 1.2 | Add `updateNoticia` action | ✅ Complete | `src/lib/actions/general.actions.ts:393-407` |
| 1.3 | Add `updateVideo` action | ✅ Complete | `src/lib/actions/general.actions.ts:409-423` |
| 1.4 | Add `updateGaleria` action | ✅ Complete | `src/lib/actions/general.actions.ts:425-439` |
| 1.5 | Add `updatePodcast` action | ✅ Complete | `src/lib/actions/general.actions.ts:441-455` |
| 1.6 | Add `initialContent` prop to `Editor.tsx` | ✅ Complete | `src/components/Editor.tsx:25,78-82` |
| 2.1 | Create `src/components/ui/dialog.tsx` | ✅ Complete | File created; follows `sheet.tsx` pattern. |
| 3.1 | Create `NoticiaEditDialog.tsx` | ✅ Complete | `src/components/NoticiaEditDialog.tsx` |
| 3.2 | Create `VideoEditDialog.tsx` | ✅ Complete | `src/components/VideoEditDialog.tsx` |
| 3.3 | Create `GaleriaEditDialog.tsx` | ✅ Complete | `src/components/GaleriaEditDialog.tsx` |
| 3.4 | Create `PodcastEditDialog.tsx` | ✅ Complete | `src/components/PodcastEditDialog.tsx` |
| 4.1 | Modify `NoticiaCard.tsx` | ✅ Complete | Pencil button wired; dialog mounted. |
| 4.2 | Modify `VideoCard.tsx` | ✅ Complete | Pencil button wired; export renamed to `VideoCard`. |
| 4.3 | Modify `GaleriaCard.tsx` | ✅ Complete | Pencil button wired; dialog mounted. |
| 4.4 | Modify `PodcastCard.tsx` | ✅ Complete | Pencil button wired; dialog mounted. |

---

## Build / Tests / Coverage Evidence

| Check | Command | Result |
|---|---|---|
| TypeScript strict compile | `npx tsc --noEmit` | ✅ Passed (no output, no errors) |
| Test runner | N/A | ⚠️ Not configured (strict TDD = false) |
| Lint / format | N/A | Not executed |

---

## Spec Compliance Matrix

> **Note:** `spec.md` is **missing** from `openspec/changes/validar-publicacion-edicion/`. Compliance is evaluated against `proposal.md`, `design.md`, and `tasks.md`.

| Requirement (source) | Status | Evidence |
|---|---|---|
| Dialog wrapper following shadcn/ui patterns (proposal) | ✅ Met | `dialog.tsx` mirrors `sheet.tsx` (Radix primitives, `data-slot`, `cn`, animations). |
| Edit button on all 4 card types in validation mode (proposal) | ✅ Met | Pencil icon button present in `NoticiaCard`, `VideoCard`, `GaleriaCard`, `PodcastCard` when `validationMode=true`. |
| Per-type dialogs with correct fields (proposal) | ✅ Met | Title, description, content/imageUrl for Noticia; title, description, url for Video/Podcast; title, description for Galeria. |
| Content preview: HTML toggle, iframe, carousel (proposal) | ✅ Met | Noticia has preview toggle with `dangerouslySetInnerHTML`; Video/Podcast use `iframe`; Galeria shows read-only image list. |
| Dual action: Save (pending) and Save+Approve (proposal) | ✅ Met | All dialogs expose both buttons; `approve` flag passed to actions. |
| Firestore `updateDoc` functions for all 4 collections (proposal) | ✅ Met | `updateNoticia`, `updateVideo`, `updateGaleria`, `updatePodcast` use `updateDoc`. |
| Sonner toasts + Spinner during saves (proposal) | ✅ Met | `toast.success/error` and `<Spinner className="mr-2" />` used. |
| TipTap editor accepts initial content (design) | ✅ Met | `Editor.tsx` added `initialContent` prop + `useEffect` with `setContent`. |
| Card-local state ownership (design) | ✅ Met | Cards own `dialogOpen` and `visible` state; dialogs own form state. |
| Save transaction: single `updateDoc` (design) | ✅ Met | No batching; single doc update per type. |
| VideoCard export name fix (design) | ✅ Met | Component and export renamed to `VideoCard`. |
| `EditDialogProps` interface (design) | ✅ Met | Defined in `types/index.ts:163-168`. |
| Required field validation before save (proposal) | ✅ Met | `title.trim()` validated in all dialogs; Video/Podcast also validate `url`. |
| Mobile-responsive dialogs (design) | ✅ Met | `sm:max-w-2xl`, `w-[calc(100%-2rem)]`, scrollable content, stacked footer buttons on mobile. |
| Backward compatibility for `Editor.tsx` (design) | ✅ Met | Existing create pages omit `initialContent`; behavior unchanged. |

---

## Correctness Table

| Aspect | Verdict | Notes |
|---|---|---|
| Types match implementation | ✅ Pass | Interfaces align with action signatures. |
| Actions use correct Firebase client SDK | ✅ Pass | Imports `db` from `firebase/client`; uses `doc`/`updateDoc` from `firebase/firestore`. |
| Optional `approve` sets state | ✅ Pass | `if (approve) payload.state = "aprobado"`. |
| Dialogs call correct update action | ✅ Pass | Noticia→`updateNoticia`, Video→`updateVideo`, etc. |
| Cards hide after save/approve | ✅ Pass | `onSaved` triggers `setVisible(false)` in all cards. |
| Error handling returns `{ ok, error }` | ✅ Pass | Consistent with existing action patterns. |
| Unused imports / dead code | ⚠️ Warning | `Pencil` imported but unused in `NoticiaEditDialog.tsx`. |
| Console noise in modified files | ⚠️ Warning | Pre-existing `console.log`/`console.error` left in card files. |

---

## Design Coherence Table

| Decision | Implementation | Deviation | Severity |
|---|---|---|---|
| Dialog primitive = Radix Dialog | `dialog.tsx` uses `@radix-ui/react-dialog` | None | — |
| State ownership = Card-local | Cards hold `open`/`visible`; dialogs hold form | None | — |
| Editor init = `initialContent` prop + effect | `Editor.tsx` uses `useEffect` + `setContent` | None | — |
| Save transaction = single `updateDoc` | Single `updateDoc` per action | None | — |
| Card type fix = rename export | `VideoCard` exported correctly | None | — |
| Preview = read-only HTML / iframe / carousel | Implemented as specified | Minor: Noticia preview lacks sanitization | Warning |
| `onSaved` only on approve | `onSaved` called on **both** save and approve | Deviation from `design.md` | None* |

\* *Note: `tasks.md` and `proposal.md` explicitly expect the card to hide after both "Guardar Cambios" and "Guardar y Aprobar", so the implementation is coherent with the authoritative task list despite the design doc saying otherwise.*

---

## Findings

### CRITICAL
*None found.*

### WARNING

1. **XSS Surface in Noticia Preview (`NoticiaEditDialog.tsx:107-110`)**
   - **What:** The HTML preview uses `dangerouslySetInnerHTML={{ __html: content }}` without any sanitization.
   - **Risk:** If a malicious actor gains Firestore write access (or injects payload via a compromised client), scripting can execute in the admin's browser.
   - **Suggested fix:** Import a lightweight sanitizer such as `DOMPurify` (already common in React ecosystems) and run `content` through it before rendering:
     ```tsx
     import DOMPurify from "dompurify";
     <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
     ```

2. **TipTap Editor Stale State on Dialog Reopen (`NoticiaEditDialog.tsx:157`)**
   - **What:** The `Editor` component is not remounted when the dialog reopens for the same item. Because `initialContent` is the same string, the `useEffect` inside `Editor` does not fire again, so the editor retains text from a previous (cancelled) edit.
   - **Risk:** Admin sees stale editor content that does not match the preview or the original item.
   - **Suggested fix:** Force remount the editor when the item changes or when the dialog opens:
     ```tsx
     <Editor key={item.id} onChange={setContent} initialContent={item?.content} />
     ```

3. **Pre-existing `console.log` / `console.error` in Modified Cards**
   - **Files:**
     - `NoticiaCard.tsx:36,58` — `console.log("Ocurrio un Error", error)`
     - `VideoCard.tsx:35,57` — `console.log("Ocurrio un Error", error)`
     - `PodcastCard.tsx:35,57` — `console.log("Ocurrio un Error", error)`
     - `GaleriaCard.tsx:48,70` — `console.error(...)`
   - **What:** These were already present, but the files were modified as part of this change. Per project conventions (`AGENTS.md`: "No dejar `console.log` en producción"), they should be removed or replaced with a proper logger.
   - **Suggested fix:** Delete the `console.log`/`console.error` lines; error feedback is already provided via Sonner toasts.

4. **Unused Import (`NoticiaEditDialog.tsx:5`)**
   - **What:** `import { Pencil } from "lucide-react";` is declared but never referenced.
   - **Suggested fix:** Remove the import.

5. **Missing Server-Side Auth Checks in Update Actions (`general.actions.ts:393-454`)**
   - **What:** `updateNoticia`, `updateVideo`, `updateGaleria`, `updatePodcast` do not verify the caller is an admin before writing to Firestore. They rely solely on UI hiding the edit buttons.
   - **Risk:** A non-admin with the function name could theoretically call these actions if they are ever exposed via an API route or if client-side security rules are misconfigured.
   - **Suggested fix:** Add an auth check inside each action (e.g., verify the current Firebase Auth user has `role === "admin"` in Firestore) or enforce strict Firestore Security Rules server-side.

### SUGGESTION

1. **Accessibility: Icon-only buttons lack `aria-label`**
   - The new Pencil buttons (and existing Check/Trash buttons) in all 4 cards contain only an icon. Add `aria-label="Editar"` to the Pencil buttons for screen readers.

2. **Consider `useCallback` for `handleSave` in dialogs**
   - Not required for v1, but wrapping `handleSave` in `useCallback` can reduce re-renders of footer buttons.

3. **Use `Image` component for Galeria preview thumbnails**
   - `GaleriaEditDialog.tsx:86` uses a raw `<img>` tag. For consistency with the rest of the app, consider using Next.js `<Image>` with `unoptimized` if external URLs are involved.

---

## Risks After Verification

| Risk | Level | Mitigation |
|---|---|---|
| Stored XSS in admin preview | Medium | Apply DOMPurify sanitization before rendering HTML preview. |
| Stale editor content after cancel/reopen | Low | Add `key={item.id}` to `Editor` inside `NoticiaEditDialog`. |
| Unauthorized write if action exposed | Low | Add server-side auth guard or enforce Firestore Security Rules. |
| Console noise in production | Very Low | Remove `console.log` lines from modified card files. |

---

## Artifacts

- **Report file:** `openspec/changes/validar-publicacion-edicion/verify-report.md`

## Next Recommended Step

`/sdd-archive` — the change is functionally complete and safe to archive after the listed warnings are triaged. At minimum, address the unused import and the stale-editor key before merge. The XSS sanitization should be a fast follow.
