"""Extract pages and text from project PDFs into assets/proyectos/<slug>/.

Strategy: rasterize every PDF page at 200 DPI to WebP. This captures the full
designed layout (renders, planos, moodboards, annotations) page-by-page, which
is what an interior-design portfolio needs to show.
"""
from __future__ import annotations

import io
import json
import shutil
import sys
from pathlib import Path

import fitz
from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parent.parent
PDF_DIR = ROOT / "proyectos"
OUT_DIR = ROOT / "assets" / "proyectos"
TXT_DIR = ROOT / "scripts" / "_extracted_text"

PROJECT_FILES = {
    "grill-bar": "Grill-Bar .pdf",
    "iluminacion-mexico": "iluminacion mexico.pdf",
    "perfumeria-orto-parisi": "PERFUMERIA ORTO PARISI.pdf",
    "spa-recepcion": "SPA RECEPCION.pdf",
}
CV_FILE = "cv naia.pdf"

RASTER_DPI = 200
WEBP_QUALITY = 85
MAX_WIDTH = 2200
TRIM_BG = (255, 255, 255)
TRIM_PADDING = 40


def trim_bg(img: Image.Image, bg=TRIM_BG, threshold: int = 12) -> Image.Image:
    """Trim solid-color borders (default white) leaving small padding."""
    if img.mode != "RGB":
        img = img.convert("RGB")
    bg_img = Image.new("RGB", img.size, bg)
    diff = ImageChops.difference(img, bg_img)
    if threshold:
        diff = diff.point(lambda p: 255 if p > threshold else 0)
    bbox = diff.getbbox()
    if not bbox:
        return img
    x0, y0, x1, y1 = bbox
    pad = TRIM_PADDING
    x0 = max(0, x0 - pad)
    y0 = max(0, y0 - pad)
    x1 = min(img.width, x1 + pad)
    y1 = min(img.height, y1 + pad)
    return img.crop((x0, y0, x1, y1))


def save_webp(img: Image.Image, out_path: Path) -> None:
    if img.mode in ("CMYK", "P"):
        img = img.convert("RGB")
    if img.mode == "RGBA":
        bg = Image.new("RGB", img.size, (255, 255, 255))
        bg.paste(img, mask=img.split()[-1])
        img = bg
    if img.width > MAX_WIDTH:
        ratio = MAX_WIDTH / img.width
        img = img.resize((MAX_WIDTH, int(img.height * ratio)), Image.LANCZOS)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(out_path, "WEBP", quality=WEBP_QUALITY, method=6)


def render_page(page: fitz.Page) -> Image.Image:
    pix = page.get_pixmap(dpi=RASTER_DPI, alpha=False)
    return Image.frombytes("RGB", (pix.width, pix.height), pix.samples)


def extract_project(slug: str, pdf_path: Path) -> dict:
    out_dir = OUT_DIR / slug
    if out_dir.exists():
        shutil.rmtree(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    doc = fitz.open(pdf_path)
    text_parts: list[str] = []
    saved = 0

    for page in doc:
        text_parts.append(page.get_text("text"))
        page_img = render_page(page)
        page_img = trim_bg(page_img)
        saved += 1
        save_webp(page_img, out_dir / f"{saved:02d}.webp")

    full_text = "\n".join(text_parts).strip()
    TXT_DIR.mkdir(parents=True, exist_ok=True)
    (TXT_DIR / f"{slug}.txt").write_text(full_text, encoding="utf-8")

    return {
        "slug": slug,
        "pdf": pdf_path.name,
        "pages": len(doc),
        "images": saved,
        "text_chars": len(full_text),
        "text_preview": full_text[:600],
    }


def extract_cv() -> dict:
    pdf_path = PDF_DIR / CV_FILE
    doc = fitz.open(pdf_path)
    text = "\n".join(p.get_text("text") for p in doc).strip()
    TXT_DIR.mkdir(parents=True, exist_ok=True)
    (TXT_DIR / "cv.txt").write_text(text, encoding="utf-8")
    return {
        "slug": "cv",
        "pdf": pdf_path.name,
        "pages": len(doc),
        "images": 0,
        "text_chars": len(text),
        "text_preview": text[:600],
    }


def main() -> int:
    if not PDF_DIR.exists():
        print(f"PDF dir not found: {PDF_DIR}", file=sys.stderr)
        return 1

    summaries: list[dict] = []
    for slug, fname in PROJECT_FILES.items():
        pdf_path = PDF_DIR / fname
        if not pdf_path.exists():
            print(f"missing: {pdf_path}", file=sys.stderr)
            continue
        print(f"-> {slug} ({fname})")
        summaries.append(extract_project(slug, pdf_path))

    summaries.append(extract_cv())

    print("\n=== SUMMARY ===")
    for s in summaries:
        print(f"\n[{s['slug']}] {s['pdf']}")
        print(f"  pages={s['pages']} images={s['images']} text_chars={s['text_chars']}")
        preview = s['text_preview'][:300].replace(chr(10), ' / ')
        print(f"  preview: {preview}")

    (ROOT / "scripts" / "_summary.json").write_text(
        json.dumps(summaries, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
