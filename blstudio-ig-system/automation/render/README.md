# automation/render — Carrusel Studio

Generador de visuales de marca (HTML) + render a PNG. Ver `docs/render-pipeline.md`.

## Uso

```bash
python3 automation/render/build.py            # genera los 12 HTML
python3 automation/render/build.py <post_id>  # uno solo

python3 automation/render/render.py           # renderiza los 12 a PNG
python3 automation/render/render.py <post_id> # uno solo
```

## Archivos

- `build.py` — lee `content/queue/*.json` y emite `assets/<tipo>/<post_id>/index.html`
  (autodescargable con html2canvas). Incluye el auto-ajuste de tipografía server-side.
- `render.py` — HTML → WeasyPrint → PDF → PyMuPDF → `png/slide-NN.png` + `cover.png`.
- `assets/fonts.css` — @font-face embebidos (Space Grotesk, Inter, IBM Plex Mono).
- `assets/studio.css` — CSS base de la identidad.

El HTML es **self-contained** (fuentes y fotos IA embebidas): se puede abrir en
cualquier navegador y bajar los slides con el botón "DESCARGAR".
