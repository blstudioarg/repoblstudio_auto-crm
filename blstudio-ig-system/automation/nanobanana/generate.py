#!/usr/bin/env python3
"""
BLStudio — Generador de imágenes IA con NanoBanana (Google Gemini Flash Image).

Uso:
    NANOBANANA_API_KEY=tu_key  python3 generate.py "PROMPT" salida.png

Notas:
- "Nano Banana" es el modelo de imagen de Google: gemini-2.5-flash-image.
- Requiere una API key de Gemini con billing activado (la generación de imágenes
  no entra en el free tier).
- La key se lee de la variable de entorno NANOBANANA_API_KEY. NUNCA hardcodear.
"""
import os, sys, json, base64, urllib.request

MODEL = "gemini-2.5-flash-image"
URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent"

# Prompt base gastronómico de BLStudio — anteponer el visual_brief del post.
PROMPT_BASE = (
    "{brief}. Fotografia gastronomica argentina realista, luz dramatica, "
    "colores calidos, alta calidad. Fondo oscuro. Sin texto en la imagen, "
    "sin diseno grafico generico."
)

def generate(prompt: str, outpath: str) -> None:
    key = os.environ["NANOBANANA_API_KEY"]
    body = {"contents": [{"parts": [{"text": prompt}]}]}
    req = urllib.request.Request(
        URL, data=json.dumps(body).encode(),
        headers={"Content-Type": "application/json", "x-goog-api-key": key},
    )
    r = urllib.request.urlopen(req, timeout=60)
    data = json.load(r)
    parts = data["candidates"][0]["content"]["parts"]
    img = next((p["inlineData"]["data"] for p in parts if "inlineData" in p), None)
    if not img:
        raise RuntimeError("La respuesta no trajo imagen: " + json.dumps(data)[:300])
    with open(outpath, "wb") as f:
        f.write(base64.b64decode(img))
    print(f"OK {outpath} ({os.path.getsize(outpath)} bytes)")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Uso: NANOBANANA_API_KEY=... python3 generate.py \"PROMPT\" salida.png")
        sys.exit(1)
    generate(sys.argv[1], sys.argv[2])
