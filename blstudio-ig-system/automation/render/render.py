#!/usr/bin/env python3
"""
BLStudio — Renderiza los visuales a PNG (sin navegador).

Pipeline 100% pip: HTML -> WeasyPrint -> PDF -> PyMuPDF -> PNG.
Reusa los mismos constructores de slides que build.py, así que el PNG es
idéntico al HTML interactivo.

Uso:
    python3 automation/render/render.py            # los 12
    python3 automation/render/render.py 2026-07-vie-sem3
"""
import os, sys, glob, json
import weasyprint, fitz
import build

ROOT = build.ROOT
QUEUE = build.QUEUE
ASSETS = build.ASSETS
FORMAT_DIR = build.FORMAT_DIR


def _write(path, data: bytes):
    # open('wb') trunca sin unlink -> funciona en carpetas montadas
    with open(path, "wb") as f:
        f.write(data)


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
    n = 0
    for i in range(doc.page_count):
        page = doc[i]
        scale = w / page.rect.width
        pix = page.get_pixmap(matrix=fitz.Matrix(scale, scale), alpha=False)
        data = pix.tobytes("png")
        _write(os.path.join(pngdir, f"slide-{i+1:02d}.png"), data)
        if i == 0:
            _write(os.path.join(outdir, "cover.png"), data)
        n += 1
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
        print("OK %-18s %-9s %d PNG -> %s" % (
            post["post_id"], post["format"], n, os.path.relpath(pngdir, ROOT)))
    print("\n%d PNG renderizado(s)." % total_png)


if __name__ == "__main__":
    main()
