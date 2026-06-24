# Fase 6 — Imágenes IA con NanoBanana

Genera las imágenes fotorrealistas de los posts premium (portadas, cierres, casos del Pilar 5) usando **NanoBanana** = el modelo de imagen de Google (`gemini-2.5-flash-image`).

## Requisitos

- Una **API key de Gemini** con **billing activado** (la generación de imágenes no entra en el free tier; con free tier da error `quota limit: 0`).
- Guardar la key en la variable de entorno `NANOBANANA_API_KEY`. Nunca en el repo.

> Ojo: el plan pago de la web app nanobanana.io (créditos) es **distinto** de esta API key de Gemini. Para generar por código, hace falta billing en el proyecto de la key.

## Uso

```bash
NANOBANANA_API_KEY=tu_key python3 generate.py "PROMPT COMPLETO" salida.png
```

El prompt base gastronómico está en `generate.py` (`PROMPT_BASE`): antepoé el `visual_brief` del post y agrega el estilo (foto argentina realista, luz dramática, fondo oscuro, sin texto).

## Flujo recomendado por post con imagen

1. Tomar el `visual_brief` del post (de `content/queue/{post_id}.json`).
2. Generar la imagen: `generate.py "{visual_brief}. Fotografia gastronomica..." assets/images/{post_id}.png`.
3. Embeberla en el visual (carrusel/historia/reel) o subirla al `image_url` para n8n.

## Reglas

- **Sin texto en la imagen IA**: el texto se agrega en el HTML/template con la tipografía de marca.
- Fondo oscuro siempre, para que combine con la identidad (negro + lima).
- Pilar 5 (casos) y portadas/cierres de carrusel = candidatos a imagen IA. Los slides de lista van tipográficos.

## Ejemplo real (carrusel "4 errores", julio sem 1)

Se generaron 2 imágenes con este flujo:
- Portada: hamburguesa artesanal con vapor sobre fondo negro.
- Cierre: cocina en acción con tablet de comandas en foco.

Ambas quedaron embebidas en `assets/carruseles/2026-07-mie-sem1/carrusel.html`.
