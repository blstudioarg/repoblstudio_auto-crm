# Pipeline de render — Carrusel Studio

Cómo se convierte el copy de un post en imágenes listas para Instagram, con la
identidad visual de BLStudio, sin depender de Canva ni de un navegador.

## Componentes

```
content/queue/<post_id>.json   (copy: caption, slide_texts, hashtags, visual_brief)
            │
            ▼
automation/render/build.py     → assets/<tipo>/<post_id>/index.html   (HTML autodescargable)
            │
            ▼
automation/render/render.py    → assets/<tipo>/<post_id>/png/slide-NN.png  (PNG por slide)
            │
   (opcional, en paralelo)
automation/nanobanana/gen_images.py → assets/images/<post_id>-<role>.b64  (foto IA hero)
```

`build.py` y `render.py` comparten los mismos constructores de slides, así que el
PNG es idéntico al HTML. Las fuentes van **embebidas** (base64) → todo offline.

## Identidad (de `design/brand/tokens.json`)

- Fondo `#0a0a0a`, acento lima `#a8ff3e`, texto blanco / gris.
- Tipografías: **Space Grotesk** (titulares), **Inter** (cuerpo), **IBM Plex Mono** (etiquetas/numeración).
- Tono: aliado directo, argentino, sin chamuyo técnico.

## Layouts

| Formato | Tamaño | Estructura |
|---|---|---|
| Historia | 1080×1920 | 1 frame por beat: portada (foto+hook) · frames de texto centrado con número fantasma · CTA en lima |
| Reel | 1080×1920 | Igual que Historia; sirve como **portada + storyboard** de texto on-screen del reel |
| Carrusel | 1080×1350 | Portada (foto+título) · slides numerados (titular + cuerpo) · cierre/CTA en lima |

## Auto-ajuste de tipografía

WeasyPrint no ejecuta JS, así que `build.py` calcula el tamaño de fuente en Python
(`fit_size`) estimando el ancho de glifo por fuente y reduciendo hasta que el texto
entra en su caja (ancho → nº de líneas; alto → límite vertical). Por eso **ningún
texto se corta**, sin importar el largo del copy. El HTML interactivo además trae un
refinamiento JS opcional.

## Fotos IA (Nano Banana Pro)

- `automation/nanobanana/generate.py`: cliente de la API de Gemini Image. Default
  `gemini-3-pro-image-preview` (Nano Banana Pro); alternativo `gemini-2.5-flash-image`
  vía `NANOBANANA_MODEL`. La key se lee de `NANOBANANA_API_KEY` (nunca se hardcodea).
- `automation/nanobanana/gen_images.py`: batch con prompts curados por post para
  **portadas** y **cierres**, recorta al aspecto exacto del slide y guarda
  `assets/images/<post_id>-<role>.b64` (data-uri que `build.py` embebe) + un `.jpg` de preview.
- Regla: **sin texto en la imagen IA**; el texto lo pone el HTML con la tipografía de marca.
  Fondo oscuro siempre, con espacio negativo arriba para el overlay.

## Dependencias

```bash
pip install weasyprint pymupdf pillow --break-system-packages
```

(WeasyPrint usa cairo/pango del sistema; PyMuPDF y Pillow traen todo en la wheel.)

## Notas

- `image_url` en los JSON apunta al `cover.png` local; para publicar en Meta hay que
  servir las imágenes en una **URL pública** (Meta descarga desde sus servidores).
- Carpeta montada: el render escribe PNG con `open('wb')` (truncar) porque el `unlink`
  no está permitido en el volumen montado.
