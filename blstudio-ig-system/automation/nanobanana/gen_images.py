#!/usr/bin/env python3
"""
BLStudio — Batch de imágenes IA (Nano Banana Pro) para portadas y cierres.

Genera la foto "hero" de cada post (portada) y el cierre de los carruseles,
recorta al aspecto exacto del slide y guarda:

    assets/images/<post_id>-<role>.b64   (data-uri que build.py embebe)
    assets/images/<post_id>-<role>.jpg   (preview)

Reusa cualquier imagen IA previa (no regenera si el .b64 ya existe).
Después de correr esto, ejecutá build.py y render.py para incrustar las fotos.

Uso:
    NANOBANANA_API_KEY=tu_key python3 automation/nanobanana/gen_images.py
    NANOBANANA_API_KEY=tu_key python3 automation/nanobanana/gen_images.py 2026-07-vie-sem1
"""
import os, sys, io, base64
from PIL import Image

HERE = os.path.dirname(__file__)
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
IMG_DIR = os.path.join(ROOT, "assets", "images")
sys.path.insert(0, HERE)
import generate as gen  # noqa

STYLE = (
    " Cinematic Argentine gastronomy/business photography, dramatic warm side "
    "lighting, deep near-black background with generous empty dark space for "
    "text overlay, photorealistic, 50mm, shallow depth of field. "
    "No text, no logos, no watermarks, no graphic design, no readable signage."
)

# aspecto y tamaño exacto por formato
SIZE = {"9:16": (1080, 1920), "4:5": (1080, 1350)}

# role -> (aspect, prompt-base). post_id define el aspecto por su formato.
COVERS = {
    "2026-07-lun-sem1": ("9:16", "A smartphone glowing with a local map search results screen, resting on a dark wooden restaurant counter, a juicy burger and fries softly out of focus behind it, moody night light."),
    "2026-07-lun-sem2": ("9:16", "A messy pile of handwritten paper order tickets spiked on a holder beside a clean glowing tablet on a dark kitchen pass, contrast of chaos and order, warm light."),
    "2026-07-lun-sem3": ("9:16", "Five golden review stars made of light reflecting on a dark glossy surface next to a beautifully plated gourmet burger, elegant bokeh."),
    "2026-07-lun-sem4": ("9:16", "A delivery rider's insulated backpack and a phone showing a glowing order-tracking progress bar at night, warm city street light, dark atmosphere."),
    "2026-07-mie-sem2": ("4:5", "A glowing 3D location map pin floating above a dark restaurant table set with appetizing food, cinematic, premium."),
    "2026-07-mie-sem3": ("4:5", "A hand tapping a credit card on a sleek modern payment terminal on a dark bar counter, warm reflections, fintech mood."),
    "2026-07-mie-sem4": ("4:5", "The interior of an empty modern small burger restaurant at golden hour, moody dark tones, clean and ready to open, sense of a new beginning."),
    "2026-07-vie-sem1": ("9:16", "A busy smash-burger kitchen during a Sunday dinner rush, a tall stack of fresh cheeseburgers with steam rising, stainless steel counter, dramatic warm light, energy and motion."),
    "2026-07-vie-sem2": ("9:16", "A returning customer's hands receiving a freshly wrapped burger across a warm dark cafe counter, a small loyalty card visible, intimate and friendly."),
    "2026-07-vie-sem3": ("9:16", "A traditional Argentine rotisería with golden roast chickens turning on a spit, warm amber glow, dark surroundings, a modern tablet on the counter hinting at digitalization."),
    "2026-07-vie-sem4": ("9:16", "A hand stamping a loyalty punch card on a dark table next to an appetizing combo meal and a drink, warm cozy light."),
}
CTAS = {  # solo carruseles
    "2026-07-mie-sem2": ("4:5", "A glowing verified check-mark badge hovering over a small restaurant storefront at dusk, warm light spilling out, dark cinematic."),
    "2026-07-mie-sem3": ("4:5", "A modern payment terminal glowing on a dark counter surrounded by floating icons of cash, card and mobile wallet, premium fintech mood."),
    "2026-07-mie-sem4": ("4:5", "A thriving small restaurant pass with several orders lined up and flowing smoothly, warm busy energy, dark background."),
}


def cover_crop(raw: bytes, size):
    im = Image.open(io.BytesIO(raw)).convert("RGB")
    tw, th = size
    scale = max(tw / im.width, th / im.height)
    nw, nh = int(im.width * scale + 0.5), int(im.height * scale + 0.5)
    im = im.resize((nw, nh), Image.LANCZOS)
    left, top = (nw - tw) // 2, (nh - th) // 2
    return im.crop((left, top, left + tw, top + th))


def save(post_id, role, aspect, prompt):
    os.makedirs(IMG_DIR, exist_ok=True)
    b64path = os.path.join(IMG_DIR, f"{post_id}-{role}.b64")
    if os.path.exists(b64path) and os.path.getsize(b64path) > 0:
        print(f"skip  {post_id}-{role} (ya existe)")
        return
    size = SIZE[aspect]
    raw = gen.generate_bytes(prompt + STYLE, aspect)
    img = cover_crop(raw, size)
    jpg = os.path.join(IMG_DIR, f"{post_id}-{role}.jpg")
    img.save(jpg, "JPEG", quality=88)
    buf = io.BytesIO(); img.save(buf, "JPEG", quality=88)
    uri = "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()
    open(b64path, "w", encoding="utf-8").write(uri)
    print(f"OK    {post_id}-{role} {size} -> {os.path.relpath(jpg, ROOT)}")


def main():
    only = sys.argv[1] if len(sys.argv) > 1 else None
    jobs = []
    for pid, (asp, pr) in COVERS.items():
        jobs.append((pid, "cover", asp, pr))
    for pid, (asp, pr) in CTAS.items():
        jobs.append((pid, "cta", asp, pr))
    for pid, role, asp, pr in jobs:
        if only and pid != only:
            continue
        try:
            save(pid, role, asp, pr)
        except Exception as e:
            print(f"ERROR {pid}-{role}: {e}")
    print("\nListo. Ahora: python3 automation/render/build.py && python3 automation/render/render.py")


if __name__ == "__main__":
    main()
