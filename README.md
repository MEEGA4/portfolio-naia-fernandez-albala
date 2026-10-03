# Portfolio · Naia Fernández Albalá

Portfolio web de Naia Fernández Albalá, graduada en Diseño de Interiores por IED Kunsthal Bilbao y cursando un Máster en Diseño de Interiores y Hospitality. Está pensado para compartirlo con empresas mediante GitHub Pages.

Web estática en español, hecha con HTML, CSS y JavaScript nativo, sin dependencias de ejecución ni compilación. Mantiene una estética femenina, limpia y editorial, con fondo claro, espacio en blanco y tipografías Fraunces e Inter de Google Fonts.

## Proyectos

La portada y la navegación circular entre proyectos siguen este orden:

| Proyecto | Presentación |
| --- | --- |
| [e!m · Mercado Erandio](projects/mercado-erandio.html) | TFE destacado a todo el ancho; primero las dos ilustraciones y después los dos renders. |
| [Meliá Bilbao](projects/reportaje-melia-bilbao.html) | Reportaje fotográfico del interiorismo del hotel, con ocho fotografías. |
| [Grill-Bar](projects/grill-bar.html) | Proyecto de restauración en San Sebastián. |
| [Iluminación México](projects/iluminacion-mexico.html) | Iluminación para un evento inspirado en el Día de Muertos. |
| [Perfumería Orto Parisi](projects/perfumeria-orto-parisi.html) | Diseño de un espacio comercial. |
| [Spa Recepción](projects/spa-recepcion.html) | Recepción de un espacio de bienestar. |

Cada proyecto tiene página propia y galería ampliable. Los cuatro proyectos originales incluyen descarga de PDF.

## Biografía, contacto e interacción

- Biografía actualizada: Bilbao, 2004, grado terminado y máster en curso.
- Contacto por email; el teléfono se conserva únicamente en el CV descargable.
- Botón «Descargar CV» con icono SVG de descarga, trazos redondeados y alineación centrada.
- Diseño adaptable a móvil y escritorio, menú accesible por teclado y enlace para saltar al contenido.
- Galería en un diálogo nativo, con contador, flechas, cierre con Escape y devolución del foco.
- Contenido visible sin JavaScript y animaciones que respetan la preferencia de movimiento reducido.

**Pendiente:** el [CV en PDF](<proyectos/cv naia.pdf>) todavía describe el grado como en curso. Falta actualizar su formación con el grado terminado y el máster actual.

## Estructura

```
.
├── index.html
├── projects/             # una página por proyecto
├── proyectos/            # PDFs originales (descargables desde la web)
├── Fotos TFE/            # ilustraciones y renders originales del TFE
├── fotos reportaje fotografico/ # fotografías originales del Meliá Bilbao
├── assets/
│   ├── css/styles.css
│   ├── js/main.js
│   ├── icons/favicon.svg
│   └── proyectos/        # imágenes WebP de los cuatro proyectos originales
└── scripts/extract_pdfs.py
```

Las galerías del TFE y del reportaje enlazan directamente a sus carpetas de JPEG originales. Esas carpetas deben formar parte de la publicación. Las rutas son relativas para funcionar bajo un subdirectorio de GitHub Pages.

## Vista local opcional

Solo hace falta para revisar la web en el ordenador. Desde la raíz del repositorio:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Abrir <http://127.0.0.1:8000/>. Para detener el servidor, pulsa `Ctrl+C` en su terminal.

## Re-extraer imágenes desde los PDFs

El script requiere Python, PyMuPDF y Pillow. Si necesitas instalar las bibliotecas, usa un entorno virtual local:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install pymupdf pillow
```

**La regeneración borra y recrea las carpetas de salida de los proyectos.** Antes de ejecutarla, confirma la operación y comprueba que no haya imágenes añadidas manualmente en esas carpetas.

```powershell
.\.venv\Scripts\python.exe scripts/extract_pdfs.py
```

El script procesa los cuatro PDFs definidos en `PROJECT_FILES` y extrae el texto del CV. Rasteriza las páginas a 200 DPI, recorta bordes blancos con un margen de 40 px y guarda WebP de calidad 85, con anchura máxima de 2200 px, en `assets/proyectos/<slug>/`. Añadir un PDF a `proyectos/` no lo incorpora automáticamente a la web ni al script.

## Mantenimiento y comprobaciones

Las cabeceras, pies y enlaces se repiten en cada HTML; los cambios compartidos deben aplicarse a las siete páginas.

Los enlaces al CSS y JavaScript incluyen `?v=` con los ocho primeros caracteres del SHA-256 del recurso. Actualiza su valor en todos los HTML cuando cambie el archivo para evitar versiones antiguas en la caché.

```powershell
node --check assets/js/main.js
git diff --check
```

La revisión del 04/10/2026 comprobó las siete páginas en Chrome a 320, 390 y 1280 px, sin desbordamiento horizontal; enlaces y anclas locales; menú por teclado; y apertura, navegación y cierre de las galerías.

## Despliegue

La publicación prevista es GitHub Pages desde la rama `main` y la raíz del repositorio, sin compilación y con [.nojekyll](.nojekyll). Comprueba la configuración remota de Pages antes de publicar; este README no confirma su estado actual.

Tras una publicación autorizada, revisa el enlace público en móvil y escritorio, incluyendo las seis páginas de proyecto, las imágenes y las descargas de PDF y CV. Ese enlace es el entregable para enviar a empresas.
