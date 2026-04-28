# Portfolio - Naia Fernández Albalá

Quiero que crees un portfolio web estático y lo despliegues en GitHub Pages bajo MI cuenta de GitHub. La estructura actual del proyecto es:

```
PORTFOLIO-NAIA/
└── proyectos/
    ├── cv naia.pdf
    ├── Grill-Bar .pdf
    ├── iluminacion mexico.pdf
    ├── PERFUMERIA ORTO PARISI.pdf
    └── SPA RECEPCION.pdf
```

## ⚠️ Configuración de Git (IMPORTANTE — léelo antes de tocar nada)

1. Configura git LOCALMENTE en este repo con MIS datos antes de cualquier commit:
```bash
   git config user.name "Naia Fernández Albalá"
   git config user.email "nfernandezalbala@gmail.com"
```
2. **NO incluyas a Claude/Anthropic en ningún sitio**: ni en commits, ni como co-author, ni en el README, ni en comentarios del código, ni en metadatos HTML. Nada de "Generated with Claude", nada de "Co-Authored-By: Claude". Mensajes de commit naturales y neutros (ej: "Initial commit", "Add projects section", "Fix mobile layout").
3. Antes del primer push pregúntame mi usuario de GitHub para crear el repo con el nombre correcto (`<usuario>.github.io` para que sea web principal, o `portfolio` si prefiero subdominio).

## PASO 1 — Procesar los PDFs de proyectos

Cada PDF en `/proyectos` es un proyecto de diseño de interiores con imágenes, planos y renders. Tienes que:

1. **Extraer las imágenes de cada PDF** y guardarlas en `/assets/proyectos/<nombre-proyecto>/` (kebab-case, sin tildes ni espacios). Usa `pdfimages`, `pdftoppm` o `pymupdf` (lo que tengas disponible). Si las imágenes embebidas vienen en mala calidad, rasteriza las páginas a PNG/WebP a 200 DPI mínimo.
2. **Lee el texto de cada PDF** (`pdftotext` o equivalente) para sacar título real del proyecto, descripción, ubicación, materiales, concepto, etc. Si no hay texto útil, dímelo y te paso yo la descripción de cada proyecto.
3. El PDF `cv naia.pdf` no es un proyecto: úsalo solo para extraer/confirmar datos personales y experiencia.
4. Optimiza las imágenes finales a WebP (calidad 80-85) para que la web cargue rápido. Mantén los PDFs originales accesibles en `/proyectos` por si quiero ofrecer descarga del proyecto completo.

Después de procesar, **enséñame un resumen** de qué has extraído de cada PDF (título detectado, nº de imágenes, descripción) **antes de construir la web**, para que pueda corregirte si algo no cuadra.

## PASO 2 — Diseño (inspirado en mssrgalleria.com)

No tengo capturas locales, así que entra directamente a `https://www.mssrgalleria.com` con `WebFetch` y analiza:
- Tipografía (serif display para titulares, sans-serif para cuerpo).
- Paleta (neutros, mucho blanco/crema, negro, sin colores estridentes).
- Layout: grid asimétrico de imágenes grandes, mucho espacio en blanco.
- Microinteracciones suaves (hover scale ligero, fade-in on scroll, transiciones lentas).
- Navegación minimal.

**Inspírate, no copies literal**. Adapta la estética de "galería" a un portfolio de **diseño de interiores**: las imágenes de espacios deben ser las protagonistas.

## PASO 3 — Contenido del portfolio

### Sobre mí
- **Nombre:** Naia Fernández Albalá
- **Rol:** Estudiante de Diseño de Interiores — IED Kunsthal Bilbao (4º curso)
- **Email:** nfernandezalbala@gmail.com
- **Teléfono:** +34 688 897 332
- **Ubicación:** Erandio, Vizcaya
- **Idiomas:** Español (nativa), Euskera (nativa), Inglés (B1), Francés (B1)
- **Bio:** Creativa, organizada, puntual y empática. Apasionada por el diseño y el trabajo bien hecho.

### Experiencia
- Prácticas en **UZ Architecture**
- Colaboración con IED en la **Bilbao Design Week 2023** (instalación para el ensanche)
- Azafata de eventos
- Clases particulares de matemáticas, historia y presupuestos

### Habilidades / Software
Paquete Office · Presto · Paquete Adobe (Photoshop, InDesign, Premiere Pro) · SketchUp · V-Ray · AutoCAD · Revit · Procreate

### Proyectos (los 4 PDFs, salvo el CV)
- Grill-Bar
- Iluminación México
- Perfumería Orto Parisi
- Spa Recepción

### Portfolio anterior (referencia opcional)
Intenta `WebFetch` a `https://readymag.website/u3420425459/5284372/` por si saca contexto extra de los proyectos. Si falla, ignóralo.

## PASO 4 — Estructura web

- **Hero:** nombre grande en serif display + rol + scroll indicator.
- **Proyectos (lo principal):** grid de los 4 proyectos. Cada proyecto = página/sección de detalle con galería de imágenes extraídas del PDF + descripción + datos del proyecto. Botón opcional para descargar el PDF original.
- **Sobre mí:** bio + experiencia + habilidades + idiomas en layout limpio tipo editorial.
- **Contacto:** email, teléfono, ubicación.

Responsive mobile-first. Accesible (alt text, contraste, navegación por teclado).

## PASO 5 — Stack

- HTML + CSS vanilla (o Tailwind via CDN si simplifica) + JS vanilla.
- Sin build step. GitHub Pages sirve directamente desde `main`.
- GSAP o Lenis vía CDN solo si las animaciones lo justifican.

## PASO 6 — Despliegue

1. `git init`, configura mis datos de git, primer commit.
2. Pídeme `gh auth login` si hace falta y crea el repo con `gh repo create`.
3. Push a `main`.
4. Activa GitHub Pages (Settings → Pages → Branch: main).
5. Dame la URL final cuando esté live.

## Flujo

1. **Primero**: procesa los PDFs y muéstrame el resumen de extracción.
2. **Espera mi OK** antes de empezar a construir la web.
3. Construye v1, despliega, e iteramos.
4. Pregúntame lo que necesites (usuario GitHub, qué proyecto destacar, etc.) en vez de asumir.