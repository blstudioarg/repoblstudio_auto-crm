#!/usr/bin/env python3
"""
BLStudio — Generador de visuales "Carrusel Studio".

Convierte cada JSON de content/queue/ en un HTML autodescargable con la
identidad de marca (negro + lima, Space Grotesk / Inter / IBM Plex Mono),
listo para exportar a PNG. Un layout por formato:

  - Historia / Reel  -> frames verticales 1080x1920 (1 beat por frame)
  - Carrusel         -> slides 1080x1350 (portada + lista numerada + CTA)

Las fuentes van embebidas (assets/fonts.css) => el HTML funciona offline.
Las fotos "hero" IA son opcionales: si existe assets/images/<post_id>-<role>.b64
se embeben; si no, se usa el degradado de marca como fondo.

Uso:
    python3 automation/render/build.py            # genera los 12
    python3 automation/render/build.py 2026-07-vie-sem3   # uno solo

Salida:
    assets/historias/<post_id>/index.html
    assets/carruseles/<post_id>/index.html
    assets/reels/<post_id>/index.html
"""
import json, os, re, sys, glob, html as _html

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
QUEUE = os.path.join(ROOT, "content", "queue")
ASSETS = os.path.join(ROOT, "assets")
IMG_DIR = os.path.join(ASSETS, "images")
FONTS_CSS = os.path.join(os.path.dirname(__file__), "assets", "fonts.css")
STUDIO_CSS = os.path.join(os.path.dirname(__file__), "assets", "studio.css")

PILLAR_TAG = {
    1: "SEO · GOOGLE",
    2: "ORGANIZACIÓN",
    3: "FIDELIZACIÓN",
    4: "ERRORES COMUNES",
    5: "CASO REAL",
}
FORMAT_DIR = {"Historia": "historias", "Carrusel": "carruseles", "Reel": "reels"}


def esc(s: str) -> str:
    return _html.escape(s, quote=False)


# ----------------------------------------------------------------------------
# Auto-ajuste de tipografía (server-side, para WeasyPrint que no corre JS).
# Estima el ancho de glifo medio por fuente y reduce el tamaño hasta que el
# texto entra en la caja (ancho -> nº de líneas; alto -> límite vertical).
# Calibrado contra renders reales de Space Grotesk bold / Inter.
# ----------------------------------------------------------------------------
ADV = {"display": 0.60, "body": 0.50}  # ancho medio de glifo en 'em'
LH = {"display": 1.0, "body": 1.45}


def _lines_for(text: str, size: float, box_w: float, kind: str) -> int:
    adv = ADV[kind] * size
    if adv <= 0:
        return 1
    chars_per_line = max(1, int(box_w / adv))
    lines, cur = 0, 0
    longest_word = 0
    for word in text.split():
        wl = len(word)
        longest_word = max(longest_word, wl)
        if cur == 0:
            cur = wl
        elif cur + 1 + wl <= chars_per_line:
            cur += 1 + wl
        else:
            lines += 1
            cur = wl
    if cur:
        lines += 1
    # si una palabra sola no entra, fuerza una línea extra de margen
    if longest_word > chars_per_line:
        lines += 1
    return max(1, lines)


def fit_size(text: str, box_w: float, box_h: float, fmax: float, fmin: float,
             kind: str = "display") -> float:
    size = fmax
    while size > fmin:
        lines = _lines_for(text, size, box_w, kind)
        total_h = lines * LH[kind] * size
        # ancho de la palabra más larga
        longest = max((len(w) for w in text.split()), default=1)
        word_w = longest * ADV[kind] * size
        if total_h <= box_h and word_w <= box_w:
            break
        size -= 2
    return round(max(size, fmin), 1)


def load_image_b64(post_id: str, role: str):
    """Devuelve el data-uri de la foto IA si existe, si no None."""
    p = os.path.join(IMG_DIR, f"{post_id}-{role}.b64")
    if os.path.exists(p):
        data = open(p, encoding="utf-8").read().strip()
        if data:
            return data  # ya guardado como 'data:image/...;base64,....'
    return None


# ----------------------------------------------------------------------------
# Parseo de textos de slide
# ----------------------------------------------------------------------------
def accentuate(text: str) -> str:
    """Resalta en lima la última palabra clave de un titular corto."""
    text = esc(text)
    return text


def split_lead_body(s: str):
    """Separa 'Titular. Resto del cuerpo.' -> (titular, cuerpo)."""
    s = s.strip()
    m = re.match(r"^(.{6,60}?[\.\!\?:])\s+(.+)$", s)
    if m:
        return m.group(1).rstrip(".:!?"), m.group(2)
    return s, ""


def parse_carousel_slide(text: str):
    """
    Devuelve dict {kind, number, lead, body}.
    kind: 'numbered' | 'labeled' | 'plain'
    """
    s = text.strip()
    m = re.match(r"^(\d+)\.\s*(.+)$", s)
    if m:
        num = m.group(1)
        rest = m.group(2)
        lead, body = split_lead_body(rest)
        return {"kind": "numbered", "number": num, "lead": lead, "body": body}
    m = re.match(r"^([A-Za-zÁÉÍÓÚÑáéíóúñ][\wÁÉÍÓÚÑáéíóúñ ]{1,18}):\s*(.+)$", s)
    if m:
        return {"kind": "labeled", "number": None, "lead": m.group(1), "body": m.group(2)}
    lead, body = split_lead_body(s)
    return {"kind": "plain", "number": None, "lead": lead, "body": body}


# ----------------------------------------------------------------------------
# Render de frames
# ----------------------------------------------------------------------------
BOXW = 912  # 1080 - 2*84


def hero(text, box_h, fmax, fmin, cls="hero", kind="display", box_w=BOXW):
    sz = fit_size(text, box_w, box_h, fmax, fmin, kind)
    return f"<div class='{cls}' style='font-size:{sz}px'>{esc(text)}</div>"


def frame_open(size_cls, idx, total, tag, photo_uri=None, photo_role=""):
    bg = ""
    if photo_uri:
        bg = (f"<img class='bgimg' src='{photo_uri}' alt=''>"
              f"<div class='vig'></div>")
    else:
        bg = "<div class='photo'></div><div class='vig'></div>"
    return (
        f"<section class='slide {size_cls}' data-slide='{idx:02d}'>"
        f"{bg}"
        f"<div class='tag'><span class='s'>*</span> {esc(tag)}</div>"
    )


def frame_close(idx, total):
    return (
        f"<div class='logo'>blstudio<span class='d'>.</span></div>"
        f"<div class='num'>{idx:02d} / {total:02d}</div>"
        f"</section>"
    )


def build_vertical(post):
    """Historia / Reel: un frame 1080x1920 por beat."""
    pid = post["post_id"]
    pillar = post["pillar"]
    fmt = post["format"]
    beats = post["slide_texts"]
    total = len(beats)
    tag_base = PILLAR_TAG.get(pillar, "")
    is_reel = fmt == "Reel"
    frames = []
    for i, beat in enumerate(beats):
        idx = i + 1
        is_cover = i == 0
        is_cta = ("👇" in beat) or ("Mandá MD" in beat) or ("Respondé" in beat)
        role = "cover" if is_cover else ("cta" if is_cta else None)
        photo = load_image_b64(pid, role) if role else None
        tag = (f"{'REEL' if is_reel else 'HISTORIA'} · {tag_base}" if is_cover
               else f"{tag_base} · {idx}/{total}")
        out = [frame_open("v", idx, total, tag, photo, role)]
        beat_txt = beat.replace("👇", "").strip()
        if is_cover:
            kick = "CASO REAL" if pillar == 5 else ("REEL" if is_reel else "PARA DUEÑOS DE GASTRO")
            out.append(
                "<div class='vbox cover'>"
                f"<div class='kick'>{esc(kick)}</div>"
                f"{hero(beat_txt, 880, 150, 64, 'hero')}"
                "</div>"
            )
        elif is_cta:
            out.append(
                "<div class='vbox cta'>"
                "<div class='kick'>BLSTUDIO · @blstudioarg2026</div>"
                f"{hero(beat_txt, 700, 128, 56, 'hero acc')}"
                "<div class='aline'>Sistemas para gastronomía que funcionan.</div>"
                "</div>"
            )
        else:
            out.append(
                f"<div class='ghost vghost'>{idx:02d}</div>"
                "<div class='vbox mid'>"
                f"{hero(beat_txt, 1000, 116, 50, 'hero')}"
                "</div>"
            )
        out.append(frame_close(idx, total))
        frames.append("".join(out))
    return frames, total


def build_carousel(post):
    """Carrusel: portada + slides de contenido + CTA, 1080x1350."""
    pid = post["post_id"]
    pillar = post["pillar"]
    slides_src = post["slide_texts"]
    total = len(slides_src)
    tag_base = PILLAR_TAG.get(pillar, "")
    frames = []
    # cuenta de items de contenido (numerados) para la numeración ghost
    content_n = 0
    for i, text in enumerate(slides_src):
        idx = i + 1
        is_cover = i == 0
        is_cta = ("👇" in text) or ("Mandá MD" in text)
        text_clean = text.replace("👇", "").strip()
        if is_cover:
            photo = load_image_b64(pid, "cover")
            # subtítulo entre paréntesis
            mtitle = re.match(r"^(.*?)\s*\((.*?)\)\s*$", text_clean)
            if mtitle:
                title, sub = mtitle.group(1), mtitle.group(2)
            else:
                title, sub = text_clean, ""
            kick = "CASO REAL" if pillar == 5 else "GUÍA RÁPIDA"
            out = [frame_open("c", idx, total, tag_base, photo, "cover")]
            sub_html = f"<div class='body cover-sub'>{esc(sub)}</div>" if sub else ""
            out.append(
                "<div class='cbox cover'>"
                f"<div class='kick'>{esc(kick)}</div>"
                f"{hero(title, 700, 112, 56, 'hero')}"
                f"{sub_html}"
                "</div>"
            )
            out.append(frame_close(idx, total))
            frames.append("".join(out))
        elif is_cta:
            photo = load_image_b64(pid, "cta")
            out = [frame_open("c", idx, total, tag_base, photo, "cta")]
            out.append(
                "<div class='cbox cta'>"
                "<div class='kick'>BLSTUDIO · @blstudioarg2026</div>"
                f"{hero(text_clean, 560, 92, 46, 'hero acc')}"
                "<div class='aline'>Te lo armamos. Mandá MD.</div>"
                "</div>"
            )
            out.append(frame_close(idx, total))
            frames.append("".join(out))
        else:
            content_n += 1
            p = parse_carousel_slide(text_clean)
            ghost = p["number"] or f"{content_n:02d}"
            tag = f"{tag_base} · {p['number'] or content_n}"
            out = [frame_open("c", idx, total, tag)]
            out.append(f"<div class='ghost cghost'>{esc(ghost)}</div>")
            body_html = (hero(p["body"], 360, 40, 26, "body", "body", 820)
                         if p["body"] else "")
            out.append(
                "<div class='cbox mid'>"
                f"{hero(p['lead'], 360, 82, 42, 'hero')}"
                f"{body_html}"
                "</div>"
            )
            out.append(frame_close(idx, total))
            frames.append("".join(out))
    return frames, total


EXTRA_CSS = """
.slide.v{width:1080px;height:1920px}
.slide.c{width:1080px;height:1350px}
.bgimg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1}
.vbox,.cbox{position:absolute;left:84px;right:84px;z-index:25}
/* el numero "ghost": relleno gris oscuro (funciona en WeasyPrint y html2canvas) */
.ghost{color:#1a1a1a;-webkit-text-stroke:0}
/* vertical (story/reel) */
.slide.v .vbox.cover{bottom:240px}
.slide.v .vbox.cta{bottom:300px}
.slide.v .vbox.mid{top:430px;bottom:430px;display:flex;flex-direction:column;justify-content:center}
.slide.v .kick{margin-bottom:30px}
.slide.v .aline{margin-top:40px;font-size:34px;color:#bdbdbd;font-family:var(--f-body);font-weight:400}
.vghost{font-size:1400px;right:-120px;bottom:-380px;line-height:.7}
/* carrusel */
.slide.c .cbox.cover{bottom:170px}
.slide.c .cbox.cta{bottom:210px}
.slide.c .cbox.mid{top:300px}
.slide.c .kick{margin-bottom:22px}
.slide.c .cover-sub{margin-top:24px;color:#e6e6e6;font-size:34px}
.slide.c .cbox.mid .body{margin-top:40px;max-width:820px}
.slide.c .aline{margin-top:30px}
.cghost{font-size:1180px;right:-110px;bottom:-300px;line-height:.7}
"""

FIT_JS = """
function fit(el){
  const maxH = parseFloat(el.dataset.max), minH = parseFloat(el.dataset.min);
  const parent = el.parentElement;
  let size = maxH;
  el.style.fontSize = size + 'px';
  // ancho disponible = parent; alto: que no empuje fuera del slide
  const slide = el.closest('.slide');
  const guard = 60;
  function overflow(){
    const r = el.getBoundingClientRect();
    const sr = slide.getBoundingClientRect();
    return el.scrollWidth > el.clientWidth + 1
        || r.bottom > sr.bottom - guard
        || r.top < sr.top + guard;
  }
  while(size > minH && overflow()){ size -= 2; el.style.fontSize = size + 'px'; }
}
function fitAll(){ document.querySelectorAll('.fit').forEach(fit); document.body.dataset.ready='1'; }
if(document.fonts && document.fonts.ready){ document.fonts.ready.then(fitAll); }
else { window.addEventListener('load', fitAll); }
"""

DL_JS = """
async function dl(){
  const s=document.querySelectorAll('.slide');
  const btn=document.querySelector('.dl'); btn.style.display='none';
  for(let i=0;i<s.length;i++){
    const c=await html2canvas(s[i],{scale:2,useCORS:true,backgroundColor:'#000'});
    const a=document.createElement('a');
    a.download='SLIDEPID-slide-'+String(i+1).padStart(2,'0')+'.png';
    a.href=c.toDataURL('image/png'); a.click();
    await new Promise(r=>setTimeout(r,350));
  }
  btn.style.display='block';
}
"""


def render_html(post, frames, total):
    pid = post["post_id"]
    fonts = open(FONTS_CSS, encoding="utf-8").read()
    studio = open(STUDIO_CSS, encoding="utf-8").read()
    dl = DL_JS.replace("SLIDEPID", pid)
    title = f"BLStudio - {post['topic']}"
    return (
        "<!DOCTYPE html><html lang='es'><head><meta charset='UTF-8'>"
        f"<title>{esc(title)}</title>"
        f"<style id='embedded-fonts'>{fonts}</style>"
        f"<style>{studio}{EXTRA_CSS}</style></head><body>"
        f"<div class='dl' onclick='dl()'>DESCARGAR LOS {total} SLIDES</div>"
        "<script src='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'></script>"
        + "".join(frames)
        + f"<script>{FIT_JS}{dl}</script>"
        "</body></html>"
    )


def frames_for(post):
    fmt = post["format"]
    if fmt == "Carrusel":
        frames, total = build_carousel(post)
        size = (1080, 1350)
    else:
        frames, total = build_vertical(post)
        size = (1080, 1920)
    return frames, total, size


def print_html(post, frames, size):
    fonts = open(FONTS_CSS, encoding="utf-8").read()
    studio = open(STUDIO_CSS, encoding="utf-8").read()
    w, h = size
    page_css = (f"@page{{size:{w}px {h}px;margin:0}}"
                "html,body{margin:0;padding:0;background:#000}"
                ".slide{break-after:page}")
    return (
        "<!DOCTYPE html><html lang='es'><head><meta charset='UTF-8'>"
        f"<style id='embedded-fonts'>{fonts}</style>"
        f"<style>{studio}{EXTRA_CSS}{page_css}</style></head><body>"
        + "".join(frames) + "</body></html>"
    )


def build_post(post):
    frames, total, _ = frames_for(post)
    html_doc = render_html(post, frames, total)
    outdir = os.path.join(ASSETS, FORMAT_DIR[post["format"]], post["post_id"])
    os.makedirs(outdir, exist_ok=True)
    outfile = os.path.join(outdir, "index.html")
    open(outfile, "w", encoding="utf-8").write(html_doc)
    return outfile, total


def main():
    only = sys.argv[1] if len(sys.argv) > 1 else None
    files = sorted(glob.glob(os.path.join(QUEUE, "2026-*.json")))
    n = 0
    for f in files:
        post = json.load(open(f, encoding="utf-8"))
        if only and post["post_id"] != only:
            continue
        outfile, total = build_post(post)
        n += 1
        rel = os.path.relpath(outfile, ROOT)
        print(f"OK {post['post_id']:18s} {post['format']:9s} {total} slides -> {rel}")
    print(f"\n{n} visual(es) generado(s).")


if __name__ == "__main__":
    main()
