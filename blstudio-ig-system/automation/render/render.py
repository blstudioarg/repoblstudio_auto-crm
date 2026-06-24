#!/usr/bin/env python3
"""
BLStudio — Renderiza los visuales a PNG (sin navegador).

Pipeline 100% pip (offline-friendly): HTML -> WeasyPrint -> PDF -> PyMuPDF -> PNG.
Reusa los mismos constructores de slides que build.py, así que el PNG es
idéntico al HTML interactivo.

Uso:
    python3 automation/render/render.py            # renderiza los 12
    python3 automation/render/render.py 2026-07-vie-sem3

Salida por post:
    assets/<tipo>/<post_id>/png/slide-01.png ...
    assets/<tipo>/<post_id>/cover.png   (copia del slide 1, para image_url)
"""
import os, sys, glob, json, shutil
import weasyprint, fitz
import build

ROOT = build.ROOT
QUEUE = build.QUEUE
ASSETS = build.ASSETS
FORMAT_DIR = build.FORMAT_DIR


def render_post(post):
    pid = post["post_id"]
    frames, total, size = build.frames_for(post)
    html = build.print_html(post, frames, size)
    w, h = size
    pdf_bytes = weasyprint.HTML(string=html, base_url=ROOT).write_pdf()
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    outdir = os.path.join(ASSETS, FORMAT_DIR[post["format"]], pid)
    pngdir = os.path.join(outdir, "png")
    os.makedirs(pngdir, exist_ok=True)
    # limpia PNG viejos
    for old in glob.glob(os.path.join(pngdir, "slide-*.png")):
        os.remove(old)
    n = 0
    for i in range(doc.page_count):
        page = doc[i]
        scale = w / page.rect.width
        pix = page.get_pixmap(matrix=fitz.Matrix(scale, scale), alpha=False)
        out = os.path.join(pngdir, f"slide-{i+1:02d}.png")
        pix.save(out)
        n += 1
        if i == 0:
            shutil.copyfile(out, os.path.join(outdir, "cover.png"))
    doc.close()
    return n, pngdir


def main():
    only = sys.argv[1] if len(sys.argv) > 1 else None
    files = sorted(glob.glob(os.path.join(QUEUE, "2026-*.json")))
    total_png = 0
    for f in files:
        post = json.load(open(f, encoding="utf-8"))
        if only and post["post_id"] != only:
            continue
        n, pngdir = render_post(post)
        total_png += n
        print(f"OK {post['post_id']:18s} {post['format']:9s} {n} PNG -> "
              f"{os.path.relpath(pngdir, ROOT)}")
    print(f"\n{total_png} PNG renderizado(s).")


if __name__ == "__main__":
    main()
