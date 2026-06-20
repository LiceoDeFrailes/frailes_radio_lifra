---
name: firebase
description: "Trigger: Firebase, Firestore, Auth, Storage, firebase config, collection, document, getDoc, setDoc. Firebase SDK usage rules for frailes_radio_lifra."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## Activation Contract

Use this skill when touching authentication, Firestore reads/writes, or Firebase Storage in either client or server code.

## Hard Rules

- Client code imports `auth`, `db`, `storage` from `firebase/client` (root `firebase/client.ts`). Never instantiate a second Firebase app.
- Server/API/Admin code imports from `firebase/admin` (root `firebase/admin.ts`). Do not import admin SDK in a client component.
- Authentication in React: consume `useAuth()` from `src/context/AuthContext`. Never call `getAuth()` directly in components.
- Firestore: use the modular SDK (`doc`, `getDoc`, `setDoc`, `collection`, `getDocs`, `onSnapshot`, `query`, `where`).
- Storage: use `getStorage` + `ref`/`uploadBytes`/`getDownloadURL` from the client SDK.
- Current config is HARDCODED in `firebase/client.ts`. Match the existing pattern for compatibility, but FLAG any new integration that should use env vars.

## Decision Gates

| Situation | Action |
|-----------|--------|
| Need logged-in user in a component | Use `useAuth()` from `AuthContext` |
| Firestore read in Server Component / API route | Import from `firebase/admin` |
| Firestore read in Client Component | Import `db` from `firebase/client` |
| Upload user image | `firebase/client` `getStorage` |
| New external service added | Use env vars, do NOT hardcode (flag existing pattern as debt) |

## Execution Steps

1. Determine context: client (browser) vs server (Server Component / Route Handler).
2. Pick the correct module: `firebase/client` or `firebase/admin`.
3. For auth state, use `useAuth()`. For auth actions (sign in/out), call `signInWithEmailAndPassword` / `signOut` on the imported `auth`.
4. Use modular Firestore functions only — no compat/firebase v8 namespacing.
5. For Storage, use `getStorage` from the client SDK; never store secrets in Storage paths.
6. If adding a new Firebase integration, prefer env-managed config and note the divergence from the hardcoded pattern.

## Output Contract

Firebase calls using the correct SDK channel (client vs admin), consuming `AuthContext` for user state, modular Firestore APIs, and Storage via the client SDK — with any hardcoded-config concerns flagged.

## References

- `firebase/client.ts` — client SDK init (auth, db, storage)
- `firebase/admin.ts` — admin SDK init
- `src/context/AuthContext.tsx` — `AuthProvider` and `useAuth()` hook
- `src/app/radioLifra/noticias/agregarNoticia/page.tsx` — Firestore write example