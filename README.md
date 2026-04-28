# Portfolio · Naia Fernández Albalá

Portfolio web estático de Naia Fernández Albalá, estudiante de Diseño de Interiores en IED Kunsthal Bilbao. Reúne cuatro proyectos académicos —Grill-Bar, Iluminación México, Perfumería Orto Parisi y Spa Recepción— junto a una sección «Sobre mí» con CV descargable y contacto directo.

## Estructura

```
.
├── index.html
├── projects/             # una página por proyecto
├── proyectos/            # PDFs originales (descargables desde la web)
├── assets/
│   ├── css/styles.css
│   ├── js/main.js
│   ├── icons/favicon.svg
│   └── proyectos/        # imágenes WebP extraídas de cada PDF
└── scripts/extract_pdfs.py
```

## Ejecutar en local

```bash
python -m http.server 8000
```

Abrir `http://localhost:8000`.

## Re-extraer imágenes desde los PDFs

Si se actualizan los PDFs en `proyectos/`:

```bash
python -m pip install --user pymupdf pillow
python scripts/extract_pdfs.py
```

El script rasteriza cada página a 200 DPI, recorta los márgenes en blanco y guarda WebP de calidad 85 en `assets/proyectos/<slug>/`.

## Despliegue

GitHub Pages sirve directamente desde la rama `main`, sin build step. Tipografías cargadas desde Google Fonts.
