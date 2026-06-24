# Prompt de guion de Reel

Para generar el guion + textos on-screen de un Reel del calendario.

## Instrucción

```
Generá el guion del Reel {post_id} del calendario.

FORMATO
- Duración objetivo: 15-30 segundos.
- Estructura: HOOK (0-3s) → DESARROLLO (3-20s) → CTA (final).
- El hook tiene que frenar el scroll en los primeros 3 segundos.

OUTPUT (devolver como JSON dentro del post)
- "hook": frase de apertura (texto on-screen del primer frame).
- "slide_texts": lista de textos on-screen por escena (cortos, 1 línea c/u).
- "voiceover": guion hablado opcional (tono aliado, argentino).
- "caption": el texto del post para el feed.
- "cta": cierre directo ("Respondé esta historia / mandá MD").

TONO
Aliado, argentino, de igual a igual, sin jerga. Ver docs/design-system.md.
SIN nombres propios de personas: referirse al cliente por rol ("el dueño") o por el negocio.

CONTENIDO
Usar el topic y el visual_brief del post. Para casos reales, números concretos
(Tcocina 150 pedidos, Doña Clara $2M / 2 semanas, La Ventera #1 en Google).
```

## Notas

- El thumbnail del reel se arma en Canva (1080×1920) con el hook como texto principal.
- Mantener 1 sola idea por reel. Mejor corto y claro que largo y completo.
- Si hay material real (cocina, sistema en pantalla), usarlo: la prueba vende más que la animación.
