# Frida Delgadillo · Portafolio

Portafolio de **Frida Delgadillo García**, estudiante de Diseño Gráfico y Animación (Torreón, México): animación 2D, modelado 3D, branding y UX/UI.

Disponible en español (`/es`) e inglés (`/en`), con CV imprimible en `/es/cv` y `/en/cv`.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, rutas `/[lang]`) + TypeScript
- Tailwind CSS v4
- [Motion](https://motion.dev) para animaciones y [Lenis](https://lenis.darkroom.engineering) para scroll suave

## Desarrollo

```bash
npm install
npm run dev
```

Abre http://localhost:3000 (redirige a `/es` o `/en` según el idioma del navegador).

## Dónde editar

| Qué | Archivo |
| --- | --- |
| Textos del sitio y del CV | `src/i18n/dictionaries/es.ts` y `en.ts` |
| Proyectos (textos, imágenes, enlaces) | `src/data/projects.ts` |
| Correo de contacto | `siteData.email` en `src/data/projects.ts` |
| Imágenes de proyectos | `public/projects/<slug>/NN.webp` |

> Si un cambio en `globals.css` no aparece en desarrollo, detén el servidor, borra `.next` y vuelve a correr `npm run dev`.
