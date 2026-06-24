# Prompt de imagen IA (NanoBanana)

Para posts premium con imagen generada (Pilar 5 = siempre IA; el resto, opcional).

## Prompt base — gastronomía argentina

```
[visual_brief del post]. Fotografía gastronómica argentina,
luz dramática, colores cálidos, alta calidad, realista.
Fondo oscuro. NO diseño gráfico genérico, NO texto en la imagen.
```

## Cómo usarlo

1. Tomar el `visual_brief` del post (del calendario o la queue).
2. Reemplazarlo al inicio del prompt base.
3. Generar en NanoBanana (manual en nanobanana.io o via API).
4. Descargar y guardar en `assets/images/{post_id}.png`.
5. Combinar con el template de Canva (logo, lima, CTA) si la pieza lo necesita.

## Reglas

- **Sin texto en la imagen IA**: el texto se agrega en Canva con la tipografía de marca.
- Mantener fondo oscuro para que combine con la identidad.
- Realista y apetitoso (comida real argentina), no render genérico de banco de imágenes.
- Para Pilar 5 (casos), si hay foto real del cliente, preferirla sobre IA.

## Modo API (automatizado, opcional)

Claude llama a la API de NanoBanana con el prompt armado, descarga la imagen y la pasa al
template. Requiere `NANOBANANA_API_KEY` en el entorno. Costo aprox: $0.16/imagen.
