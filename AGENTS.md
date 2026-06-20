# Agent.MD — frailes_radio_lifra

> Proyecto: Liceo De Frailes — Sitio web institucional con panel de administración
> Stack: Next.js 15 + React 19 + TypeScript + Tailwind CSS v4 + Firebase

## Convenciones del Proyecto

### Arquitectura
- **App Router** (`src/app/`). Server Components por defecto.
- Usar `'use client'` solo cuando se necesiten hooks, APIs del navegador o event handlers.
- API Routes en `src/app/api/` (Route Handlers de Next.js).
- Páginas del admin en `src/app/admin/`.

### Estilo y UI
- **Tailwind CSS v4** con sintaxis moderna (`@import "tailwindcss"`, `@theme inline`).
- **shadcn/ui** como sistema de componentes base. Todos los componentes UI van en `src/components/ui/`.
- Usar `cn()` desde `@/lib/utils` para merge de clases.
- Usar **Lucide React** para íconos. No emojis en la UI.
- Tipografía principal: **Roboto** (via `next/font/google`).
- Colores de marca: `Dark-Green-Lifra` (#4C811F), `Light-Green-Lifra` (#A1D43B).
- Tema claro por defecto. Tema oscuro soportado vía `.dark`.

### Firebase
- **Cliente**: importar siempre desde `firebase/client.ts` (`auth`, `db`, `storage`).
- **Admin**: importar desde `firebase/admin.ts` para uso server-side.
- **Auth**: usar `AuthContext` (`src/context/AuthContext`). No crear instancias de auth directamente.
- Firestore: usar SDK modular (`doc`, `getDoc`, `setDoc`, `collection`, etc.).

### Calidad de Código
- TypeScript en modo **strict**.
- ESLint 9 con `next/core-web-vitals`.
- No hay formateador configurado (considerar Prettier).
- No hay tests configurados (considerar Vitest + React Testing Library).

### Reglas de Negocio / Contexto
- Es un sitio para un liceo (escuela secundaria) en Costa Rica.
- Tiene secciones públicas (noticias, galería, contacto) y panel de admin.
- El editor de contenido usa **TipTap**.
- Las imágenes se almacenan en Firebase Storage.

## Patrones Prohibidos
- No usar `var`. Usar `const` y `let`.
- No dejar `console.log` en producción.
- No hardcodear API keys (el config de Firebase actual está hardcodeado — no seguir ese patrón para nuevas integraciones).
- No mezclar lógica de Firebase Admin en componentes cliente.

## Estructura de Directorios Esperada

```
src/
  app/              # Rutas y layouts (App Router)
  components/
    ui/             # Componentes shadcn/ui
    [features]/     # Componentes de dominio
  context/          # React Context providers
  lib/              # Utilidades (cn, helpers)
  types/            # Tipos globales de TypeScript
firebase/
  client.ts         # Config Firebase cliente
  admin.ts          # Config Firebase admin
public/             # Assets estáticos
```

## Decisiones de Diseño
- Componentes UI reutilizables basados en Radix UI + CVA.
- Mobile-first responsive.
- Animaciones sutiles con Framer Motion.
- Notificaciones con Sonner (toast).
