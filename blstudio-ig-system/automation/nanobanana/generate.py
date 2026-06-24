#!/usr/bin/env python3
"""
BLStudio — Generador de imágenes IA con NanoBanana / Nano Banana Pro (Google Gemini Image).

Uso directo:
    NANOBANANA_API_KEY=tu_key python3 generate.py "PROMPT" salida.png [ASPECT]

ASPECT opcional: "9:16" | "4:5" | "1:1" (default 1:1).

Modelos (variable de entorno NANOBANANA_MODEL):
- nano banana pro  -> gemini-3-pro-image-preview   (default, máxima calidad)
- nano banana      -> gemini-2.5-flash-image

Requiere una API key de Gemini con billing activado (la generación de imágenes
no entra en el free tier). La key se lee de NANOBANANA_API_KEY. NUNCA hardcodear.
"""
import os, sys, json, base64, urllib.request, urllib.error

MODEL = os.environ.get("NANOBANANA_MODEL", "gemini-3-pro-image-preview")
URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent"


def generate_bytes(prompt: str, aspect: str = "1:1") -> bytes:
    key = os.environ["NANOBANANA_API_KEY"]
    body = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"imageConfig": {"aspectRatio": aspect}},
    }

    def _call(payload):
        req = urllib.request.Request(
            URL, data=json.dumps(payload).encode(),
            headers={"Content-Type": "application/json", "x-goog-api-key": key},
        )
        return json.load(urllib.request.urlopen(req, timeout=120))

    try:
        data = _call(body)
    except urllib.error.HTTPError:
        # algunos modelos rechazan imageConfig; reintentar sin él
        body.pop("generationConfig", None)
        data = _call(body)
    parts = data["candidates"][0]["content"]["parts"]
    img = next((p["inlineData"]["data"] for p in parts if "inlineData" in p), None)
    if not img:
        raise RuntimeError("La respuesta no trajo imagen: " + json.dumps(data)[:400])
    return base64.b64decode(img)


def generate(prompt: str, outpath: str, aspect: str = "1:1") -> None:
    raw = generate_bytes(prompt, aspect)
    with open(outpath, "wb") as f:
        f.write(raw)
    print(f"OK {outpath} ({os.path.getsize(outpath)} bytes) [{MODEL} {aspect}]")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Uso: NANOBANANA_API_KEY=... python3 generate.py \"PROMPT\" salida.png [ASPECT]")
        sys.exit(1)
    asp = sys.argv[3] if len(sys.argv) > 3 else "1:1"
    generate(sys.argv[1], sys.argv[2], asp)
