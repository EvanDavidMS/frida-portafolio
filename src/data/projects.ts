import type { Locale } from "@/i18n/config";

export type Category = "animacion" | "3d" | "diseno";

/** A string in both languages. */
type L = Record<Locale, string>;

const categoryData: Record<Category, { label: L; color: string }> = {
  animacion: { label: { es: "Animación 2D", en: "2D Animation" }, color: "var(--color-berry)" },
  "3d": { label: { es: "Modelado 3D", en: "3D Modeling" }, color: "var(--color-sky-ink)" },
  diseno: { label: { es: "Diseño & UX/UI", en: "Design & UX/UI" }, color: "var(--color-hot)" },
};

export type CategoryInfo = { label: string; color: string };

export function getCategories(lang: Locale): Record<Category, CategoryInfo> {
  return Object.fromEntries(
    (Object.keys(categoryData) as Category[]).map((k) => [k, { label: categoryData[k].label[lang], color: categoryData[k].color }]),
  ) as Record<Category, CategoryInfo>;
}

type ProjectSource = {
  slug: string;
  title: L;
  kicker: L;
  category: Category;
  sticker: L;
  summary: L;
  description: L[];
  highlights: L[];
  team?: string[];
  tools?: string[];
  images: number;
  ratio?: number;
  embed?: { src: string; label: L; ratio: number };
  source: { label: L; href: string };
};

/** A project resolved to one language, ready to render. */
export type Project = {
  slug: string;
  title: string;
  kicker: string;
  category: Category;
  sticker: string;
  summary: string;
  description: string[];
  highlights: string[];
  team?: string[];
  tools?: string[];
  /** Number of images in /public/projects/<slug>/NN.webp */
  images: number;
  /** Aspect ratio of the gallery images (width / height) */
  ratio?: number;
  embed?: { src: string; label: string; ratio: number };
  source: { label: string; href: string };
};

const viewOnCanva: L = { es: "Ver en Canva", en: "View on Canva" };
const viewOnArtStation: L = { es: "Ver en ArtStation", en: "View on ArtStation" };

const data: ProjectSource[] = [
  {
    slug: "las-aventuras-de-honey",
    title: { es: "Las Aventuras de Honey", en: "Las Aventuras de Honey" },
    kicker: { es: "Biblia de animación y animatic", en: "Animation bible & animatic" },
    category: "animacion",
    sticker: { es: "personajes con corazón", en: "characters with heart" },
    summary: {
      es: "Biblia de animación completa para un corto sobre Honey, una niña que ama jugar a las hadas, y Sage, el niño que quiere robar todos los juguetes de la ciudad.",
      en: "A complete animation bible for a short film about Honey, a little girl who loves playing fairy, and Sage, the boy who wants to steal every toy in town.",
    },
    description: [
      {
        es: "Honey, una niña que ama jugar a las hadas con su varita y sus alas, constantemente se pelea con Sage, quien planea robar los juguetes de toda la ciudad para que ningún otro niño pueda disfrutar de ellos.",
        en: "Honey, a girl who loves playing fairy with her wand and wings, is always clashing with Sage, who plans to steal every toy in the city so no other kid can enjoy them.",
      },
      {
        es: "Sage tiene un láser que teletransporta juguetes y su inteligencia lo lleva a construir aliados gigantes; Honey cuenta con una varita mágica y una mochila que le da alas para detenerlo. Para este corto desarrollamos la biblia completa: desde el logline y el guion hasta el diseño de personajes, sus paletas de color, los escenarios y el animatic final.",
        en: "Sage has a laser that teleports toys and builds giant allies; Honey has a magic wand and a backpack that gives her wings to stop him. For this short we built the full bible: from logline and script to character design, color palettes, backgrounds and the final animatic.",
      },
    ],
    highlights: [
      { es: "Logline, sinopsis y guion literario", en: "Logline, synopsis and script" },
      { es: "Guion técnico y storyboard", en: "Shooting script and storyboard" },
      { es: "Diseño de personajes (frente, lado y detrás) y expresiones", en: "Character turnarounds and expressions" },
      { es: "Paletas de color y props", en: "Color palettes and props" },
      { es: "Escenarios y animatic", en: "Backgrounds and animatic" },
    ],
    team: ["Mariana Zalazar Romero", "Alan Ponce Flores", "Frida Delgadillo García"],
    images: 16,
    embed: {
      src: "https://www.canva.com/design/DAGfAGiXZjE/S_hBhA8qprr_8ZhfZuC_Cw/view?embed",
      label: { es: "Biblia de animación completa", en: "Full animation bible" },
      ratio: 16 / 9,
    },
    source: { label: viewOnCanva, href: "https://www.canva.com/design/DAGfAGiXZjE/S_hBhA8qprr_8ZhfZuC_Cw/view" },
  },
  {
    slug: "no-era-tan-dificil",
    title: { es: "No era tan difícil", en: "No era tan difícil" },
    kicker: { es: "Campaña de concientización vial", en: "Road-safety awareness campaign" },
    category: "diseno",
    sticker: { es: "branding & campaña", en: "branding & campaign" },
    summary: {
      es: "Campaña para medios digitales que invita a jóvenes de 18 a 30 años a soltar el celular en la calle: un segundo de distracción puede cambiarlo todo.",
      en: "A digital campaign (“It wasn't that hard”) urging 18 to 30-year-olds to put their phones down on the street: one second of distraction can change everything.",
    },
    description: [
      {
        es: "La frase “no era tan difícil” apela a la ironía: resalta que muchas conductas viales irresponsables no surgen del desconocimiento, sino de no detenerse un segundo antes de actuar. El tono no juzga ni amenaza, invita a reflexionar.",
        en: "The line “it wasn't that hard” leans on irony: many reckless road behaviors don't come from not knowing better, but from not stopping for a second before acting. The tone doesn't judge or threaten; it invites reflection.",
      },
      {
        es: "El logotipo reinterpreta la señal de alto, uno de los símbolos más reconocibles del sistema vial, y el personaje “el Segundo” representa ese instante de distracción. La campaña se llevó a redes sociales con publicaciones, historias y una página de registro, y se midieron sus resultados.",
        en: "The logo reinterprets the stop sign, one of the most recognizable road symbols, and the mascot “el Segundo” (the Second) embodies that moment of distraction. The campaign ran on social media with posts, stories and a sign-up page, and its results were measured.",
      },
    ],
    highlights: [
      { es: "Naming y logotipo", en: "Naming and logo" },
      { es: "Personaje de campaña: “el Segundo”", en: "Campaign mascot: “el Segundo”" },
      { es: "Paleta de color y tipografía (Hagrid)", en: "Color palette and typography (Hagrid)" },
      { es: "Piezas para Instagram y Facebook", en: "Instagram and Facebook content" },
      { es: "Métricas: más de 8,700 visualizaciones", en: "Results: 8,700+ views" },
    ],
    team: ["Frida Delgadillo", "Max Tellez", "Mariana Salazar"],
    images: 12,
    embed: {
      src: "https://www.canva.com/design/DAHCe-YSwjY/jjipqdM5RbskFI21p0UKhw/view?embed",
      label: { es: "Presentación de la campaña", en: "Campaign presentation" },
      ratio: 16 / 9,
    },
    source: { label: viewOnCanva, href: "https://www.canva.com/design/DAHCe-YSwjY/jjipqdM5RbskFI21p0UKhw/view" },
  },
  {
    slug: "reto-techo",
    title: { es: "Reto TECHO", en: "TECHO Challenge" },
    kicker: { es: "Rediseño UX/UI para TECHO México", en: "UX/UI redesign for TECHO Mexico" },
    category: "diseno",
    sticker: { es: "ux/ui con propósito", en: "ux/ui with purpose" },
    summary: {
      es: "Rediseño del sitio de TECHO México para que voluntarios, donantes y empresas encuentren su forma de participar, y para impulsar las donaciones mensuales.",
      en: "A redesign of TECHO Mexico's website so volunteers, donors and companies can find their way to help, and to grow monthly donations.",
    },
    description: [
      {
        es: "Partimos de un análisis del sitio original: lo que ya funcionaba (impacto visual, conexión emocional, un llamado a la acción claro) y sus áreas de oportunidad en UX, diseño gráfico y accesibilidad.",
        en: "We started by auditing the original site: what already worked (visual impact, emotional connection, a clear call to action) and where UX, visual design and accessibility could improve.",
      },
      {
        es: "La propuesta asigna un color específico a cada pestaña para reforzar el orden visual, reorganiza la arquitectura con un sitemap y mapa XD, y se prototipó desde wireframes hasta un diseño final con un botón de donar más claro. El prototipo se validó con una evaluación de expertos.",
        en: "The proposal gives each section its own color to reinforce visual order, restructures the architecture with a sitemap and experience map, and was prototyped from wireframes to a final design with a clearer donate button. The prototype was validated through an expert review.",
      },
    ],
    highlights: [
      { es: "Análisis UX, gráfico y de accesibilidad", en: "UX, visual and accessibility audit" },
      { es: "Sistema de color por sección", en: "Color system per section" },
      { es: "Sitemap y mapa de experiencia", en: "Sitemap and experience map" },
      { es: "Wireframes y prototipo final", en: "Wireframes and final prototype" },
      { es: "Evaluación con expertos", en: "Expert review" },
    ],
    team: ["Mariana Salazar", "Max Tellez", "Frida Delgadillo"],
    images: 17,
    embed: {
      src: "https://www.canva.com/design/DAHLchG9mTc/WdU5uG2qi2gvFCEG0tTSrA/view?embed",
      label: { es: "Presentación del reto", en: "Challenge presentation" },
      ratio: 16 / 9,
    },
    source: { label: viewOnCanva, href: "https://www.canva.com/design/DAHLchG9mTc/WdU5uG2qi2gvFCEG0tTSrA/view" },
  },
  {
    slug: "efectos-visuales",
    title: { es: "NewJeans: del éxito al tribunal", en: "NewJeans: From Fame to Court" },
    kicker: { es: "Proyecto final de Efectos Visuales", en: "Visual Effects final project" },
    category: "animacion",
    sticker: { es: "vfx & motion", en: "vfx & motion" },
    summary: {
      es: "Video documental sobre el conflicto legal entre NewJeans, ADOR y HYBE, con una estética de papel roto, recortes de periódico y efectos visuales.",
      en: "A documentary video about the legal dispute between NewJeans, ADOR and HYBE, with a torn-paper, newspaper-clipping look and visual effects.",
    },
    description: [
      {
        es: "El documental aborda el conflicto legal entre NewJeans y su agencia ADOR, surgido tras la disputa entre HYBE y Min Hee-jin, y cómo afectó la relación del grupo con la agencia.",
        en: "The documentary covers the legal conflict between NewJeans and their agency ADOR, which followed the dispute between HYBE and Min Hee-jin, and how it affected the group's relationship with the agency.",
      },
      {
        es: "La historia se construye a través de titulares, videos y documentos, con una estética de papel roto y arrugado inspirada en los videos de Vox. El breakdown incluye cámara y objetos 3D, rotoscopia, camera tracking y recorte de trazados.",
        en: "The story is told through headlines, videos and documents, with a torn, crumpled-paper look inspired by Vox explainers. The breakdown includes 3D camera and objects, rotoscoping, camera tracking and path cutouts.",
      },
    ],
    highlights: [
      { es: "Concepto y narrativa", en: "Concept and narrative" },
      { es: "Thumbnails y storyboard", en: "Thumbnails and storyboard" },
      { es: "Cámara y objetos 3D", en: "3D camera and objects" },
      { es: "Rotoscopia y camera tracking", en: "Rotoscoping and camera tracking" },
      { es: "Recorte de trazados", en: "Path cutouts" },
    ],
    images: 9,
    embed: {
      src: "https://www.canva.com/design/DAHWjCd4GVo/5T1bdoqoTYH2dKbbafkE1Q/view?embed",
      label: { es: "Presentación del proyecto", en: "Project presentation" },
      ratio: 16 / 9,
    },
    source: { label: viewOnCanva, href: "https://www.canva.com/design/DAHWjCd4GVo/5T1bdoqoTYH2dKbbafkE1Q/view" },
  },
  {
    slug: "app-fitness",
    title: { es: "App fitness con mascota", en: "Fitness App with a Pet" },
    kicker: { es: "Investigación y diseño de app móvil", en: "Mobile app research & design" },
    category: "diseno",
    sticker: { es: "app móvil", en: "mobile app" },
    summary: {
      es: "Diseño de una app de ejercicio con una mascota que acompaña al usuario: benchmark, wireframes y pantallas finales en Figma.",
      en: "A workout app where a virtual pet keeps the user company: benchmark, wireframes and final screens in Figma.",
    },
    description: [
      {
        es: "El proceso arrancó con un benchmark de apps como Strava, FitOn y Fitis para entender cómo motivan a sus usuarios.",
        en: "The process kicked off with a benchmark of apps like Strava, FitOn and Fitis to understand how they keep users motivated.",
      },
      {
        es: "Después se definió el flujo en wireframes (inicio de sesión, mascota, temporizador y rankings) y se llevó a una interfaz final en modo oscuro con acentos de color.",
        en: "Then the flow was mapped in wireframes (login, pet, timer and leaderboards) and taken to a final dark-mode interface with color accents.",
      },
    ],
    highlights: [
      { es: "Benchmark de apps", en: "App benchmark" },
      { es: "Wireframes de baja fidelidad", en: "Low-fidelity wireframes" },
      { es: "Paleta e interfaz final", en: "Palette and final UI" },
    ],
    tools: ["Figma"],
    images: 1,
    ratio: 398 / 450,
    embed: {
      src: "https://embed.figma.com/design/1Xr4tTn0AadXAvSPohyckT/Sin-t%C3%ADtulo?embed-host=share",
      label: { es: "Archivo de Figma", en: "Figma file" },
      ratio: 4 / 3,
    },
    source: {
      label: { es: "Abrir en Figma", en: "Open in Figma" },
      href: "https://www.figma.com/design/1Xr4tTn0AadXAvSPohyckT/Sin-t%C3%ADtulo?node-id=0-1",
    },
  },
  {
    slug: "cerebros-y-cemento",
    title: { es: "Cerebros y cemento", en: "Brains & Concrete" },
    kicker: { es: "Ilustración isométrica 3D", en: "Isometric 3D illustration" },
    category: "3d",
    sticker: { es: "tierno y aterrador", en: "cute and creepy" },
    summary: {
      es: "El espacio personal de un arquitecto zombie, modelado en 3D con un estilo caricaturesco y adorable.",
      en: "A zombie architect's personal space, modeled in 3D with a cartoony, adorable style.",
    },
    description: [
      {
        es: "Este proyecto representa, a través de una ilustración isométrica, el espacio personal de un arquitecto zombie con un estilo caricaturesco y adorable.",
        en: "This isometric illustration portrays the personal space of a zombie architect in a cartoony, adorable style.",
      },
      {
        es: "La propuesta combina elementos tradicionalmente asociados con lo oscuro o aterrador con una estética tierna y creativa, generando un contraste visual intencional.",
        en: "It combines elements usually associated with the dark and scary with a sweet, playful aesthetic, creating an intentional visual contrast.",
      },
    ],
    highlights: [
      { es: "Bocetos preliminares", en: "Early sketches" },
      { es: "Composición final", en: "Final composition" },
      { es: "Texturas", en: "Texturing" },
      { es: "Render final", en: "Final render" },
    ],
    tools: ["Autodesk Maya"],
    images: 9,
    source: { label: viewOnArtStation, href: "https://www.artstation.com/artwork/DLZYzR" },
  },
  {
    slug: "atmosfera-interior",
    title: { es: "Atmósfera interior", en: "Interior Atmosphere" },
    kicker: { es: "Iluminación de escena", en: "Scene lighting" },
    category: "3d",
    sticker: { es: "de día y de noche", en: "day and night" },
    summary: {
      es: "Iluminación de una escena interior con cielo y luces ambientales, en versión diurna y nocturna.",
      en: "Lighting an interior scene with sky and ambient lights, in a daytime and a nighttime version.",
    },
    description: [
      {
        es: "En este trabajo se realizó la iluminación de una escena interior en Maya, agregando cielo y luces ambientales para generar una atmósfera más natural y equilibrada dentro del espacio.",
        en: "In this exercise I lit an interior scene in Maya, adding a sky and ambient lights to create a more natural, balanced atmosphere inside the space.",
      },
    ],
    highlights: [
      { es: "Render diurno", en: "Daytime render" },
      { es: "Render nocturno", en: "Nighttime render" },
      { es: "Luces ambientales y cielo", en: "Ambient lights and sky" },
    ],
    tools: ["Autodesk Maya"],
    images: 3,
    source: { label: viewOnArtStation, href: "https://www.artstation.com/artwork/3EJybo" },
  },
  {
    slug: "lava-lamp",
    title: { es: "Lava Lamp", en: "Lava Lamp" },
    kicker: { es: "Materiales y render con Arnold", en: "Materials & rendering with Arnold" },
    category: "3d",
    sticker: { es: "shaders brillantes", en: "glowing shaders" },
    summary: {
      es: "Una lámpara de lava con shaders de emisión, plástico y vidrio para lograr realismo en cada componente.",
      en: "A lava lamp with emission, plastic and glass shaders for realism in every part.",
    },
    description: [
      {
        es: "Proyecto de modelado 3D desarrollado en Maya enfocado en la creación y aplicación de materiales mediante Arnold.",
        en: "A 3D modeling project in Maya focused on creating and applying materials with Arnold.",
      },
      {
        es: "Se utilizó un material con emisión para simular la iluminación interna de la lava; para la base se aplicó una textura de plástico y para el contenedor se desarrolló un material de vidrio con transparencia y reflexión ajustadas.",
        en: "An emissive material simulates the lava's inner glow; the base uses a plastic texture and the container a glass material with tuned transparency and reflection.",
      },
    ],
    highlights: [
      { es: "Modelado", en: "Modeling" },
      { es: "Shader de emisión", en: "Emission shader" },
      { es: "Vidrio y plástico", en: "Glass and plastic" },
      { es: "Render desde distintos ángulos", en: "Renders from several angles" },
    ],
    tools: ["Autodesk Maya", "Arnold", "Photoshop"],
    images: 5,
    source: { label: viewOnArtStation, href: "https://www.artstation.com/artwork/YGDWZX" },
  },
  {
    slug: "lo-dulce-y-lo-natural",
    title: { es: "Lo dulce y lo natural", en: "Sweet & Natural" },
    kicker: { es: "Modelado con deformadores", en: "Modeling with deformers" },
    category: "3d",
    sticker: { es: "fresa, gelatina y flor", en: "strawberry, jelly & flower" },
    summary: {
      es: "Una fresa, una gelatina y una flor modeladas a partir de deformadores no lineales.",
      en: "A strawberry, a jelly and a flower modeled with non-linear deformers.",
    },
    description: [
      {
        es: "“Lo dulce y lo natural” es un proyecto de modelado 3D desarrollado en Autodesk Maya, enfocado en la creación de objetos a partir del uso de deformadores no lineales (squash, twist, curve y flare).",
        en: "“Sweet & Natural” is a 3D modeling project in Autodesk Maya focused on building objects with non-linear deformers (squash, twist, curve and flare).",
      },
    ],
    highlights: [
      { es: "Deformador squash", en: "Squash deformer" },
      { es: "Twist y curve", en: "Twist and curve" },
      { es: "Flare", en: "Flare" },
      { es: "Referencias visuales", en: "Visual references" },
    ],
    tools: ["Autodesk Maya", "Photoshop"],
    images: 5,
    source: { label: viewOnArtStation, href: "https://www.artstation.com/artwork/YGkqrK" },
  },
];

const localize = (p: ProjectSource, lang: Locale): Project => ({
  ...p,
  title: p.title[lang],
  kicker: p.kicker[lang],
  sticker: p.sticker[lang],
  summary: p.summary[lang],
  description: p.description.map((d) => d[lang]),
  highlights: p.highlights.map((h) => h[lang]),
  embed: p.embed && { ...p.embed, label: p.embed.label[lang] },
  source: { ...p.source, label: p.source.label[lang] },
});

export const projectSlugs = data.map((p) => p.slug);

export const getProjects = (lang: Locale) => data.map((p) => localize(p, lang));

export function getProject(slug: string, lang: Locale) {
  const p = data.find((d) => d.slug === slug);
  return p && localize(p, lang);
}

export const imageSrc = (slug: string, n: number) => `/projects/${slug}/${String(n).padStart(2, "0")}.webp`;

const siteData = {
  name: "Frida Delgadillo",
  fullName: "Frida Delgadillo García",
  role: { es: "Diseño gráfico, animación y 3D", en: "Graphic design, animation & 3D" },
  location: { es: "Torreón, México", en: "Torreón, Mexico" },
  artstation: "https://www.artstation.com/frida_delgadillo4",
  /** Pon aquí el correo de Frida para activar el botón de contacto. */
  email: "",
};

export const getSite = (lang: Locale) => ({
  ...siteData,
  role: siteData.role[lang],
  location: siteData.location[lang],
});

export type Site = ReturnType<typeof getSite>;
