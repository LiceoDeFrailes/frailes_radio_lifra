# 🎙️ Radio Lifra — Plataforma Web de Gestión de Contenidos

> Sistema web desarrollado para la administración y publicación de contenidos multimedia del **Liceo de Frailes**, integrando roles de usuario (administrador y estudiante), autenticación con Firebase y gestión centralizada de noticias, galerías, videos y podcasts.

---

## 🧩 Características Principales

- 🔐 **Autenticación con Firebase Authentication**
  - Registro y login de usuarios (administradores y estudiantes)
  - Control de acceso basado en roles
  - Cierre de sesión seguro sin necesidad de reiniciar la aplicación

- 📰 **Módulo de Noticias**
  - Creación de noticias con texto enriquecido (editor con TipTap)
  - Subida y validación de imágenes en Firebase Storage
  - Publicación sujeta a aprobación del administrador

- 🖼️ **Módulo de Galería**
  - Subida múltiple de imágenes con validación de tamaño (3 MB máx.)
  - Visualización mediante carrusel responsivo con Shadcn/UI

- 🎧 **Módulo de Podcasts**
  - Ingreso de URLs de Spotify
  - Renderizado automático mediante `iframe` con soporte para `embed`

- 🎥 **Módulo de Videos**
  - Registro de videos mediante enlaces
  - Renderizado seguro con `iframe` optimizado y `loading="lazy"`

- 🧾 **Validación de Contenido**
  - Panel de administrador para aprobar o rechazar publicaciones
  - Ordenamiento por fecha (más antiguas primero)
  - Eliminación segura de imágenes desde Cloud Storage

- 🧠 **Diseño Modular**
  - Cada tipo de publicación (noticia, galería, video, podcast) cuenta con su propio componente y lógica interna
  - Estructura escalable y mantenible

---

## 🛠️ Tecnologías Utilizadas

| Tipo | Herramientas |
|------|---------------|
| **Frontend** | [Next.js 15](https://nextjs.org/), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) |
| **UI / UX** | [Tailwind CSS](https://tailwindcss.com/), [Shadcn/UI](https://ui.shadcn.com/), [Lucide Icons](https://lucide.dev/), [Sonner](https://sonner.emilkowal.ski/) |
| **Backend / BaaS** | [Firebase](https://firebase.google.com/) (Authentication, Firestore, Storage) |
| **Editor de Texto** | [TipTap](https://tiptap.dev/) |
| **Deploy / Hosting** | [Vercel](https://vercel.com/) (recomendado) |

---

## 🚀 Instalación y Configuración

1. **Clonar el repositorio**

   - git clone https://github.com/LiceoDeFrailes/frailes_radio_lifra.git
   - npm install
   - npm run dev


