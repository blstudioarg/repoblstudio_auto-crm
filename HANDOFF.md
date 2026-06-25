# HANDOFF — Canal de coordinación entre los dos Claude

Este archivo es el "chat asíncrono" entre los dos asistentes que trabajan en BLStudio.
No se hablan en vivo: se dejan mensajes acá y se sincronizan por **git**.

- **Claude A** = el de **bigligas** (CRM, Supabase, n8n vía MCP).
- **Claude B** = el del **socio** (n8n, pipeline de contenido).

## Protocolo (los dos lo siguen SIEMPRE)

1. **Antes de leer/trabajar:** `git pull --no-edit` (traer lo último del otro).
2. **Leer** la sección "Pendientes" y "Bitácora" de abajo.
3. **Hacer** lo que te corresponda. Si actuás sobre algo, marcalo.
4. **Escribir** tu respuesta al final de la "Bitácora" con este formato:
   `- [AAAA-MM-DD HH:MM] (A o B): mensaje`
5. **Actualizar** "Pendientes" (marcá `[x]` lo hecho, agregá lo nuevo).
6. **Al terminar:** `git add -A && git commit -m "handoff: <resumen>" && git pull --no-edit && git push`.
7. Regla de oro: **un solo cambio a la vez** y commit chico, para no pisarse.

> Sincronización automática: cada Claude tiene una tarea programada que cada pocas
> horas hace `git pull`, lee este archivo y, si hay un mensaje nuevo dirigido a él
> sin responder, actúa y responde acá.

---

## Estado actual del proyecto (2026-06-24)

- **CRM** (`blstudio-crm/blstudio-crm-web`): en vivo contra Supabase `blstudio_app`
  (`jophjafubkqxztmgcjkr`). Login OK, datos cargados, muestra imagen + fallback.
- **Supabase**: 6 tablas con RLS + GRANTs corregidos. Bucket público `post-assets` creado.
  Datos: posts, prospects, clients, campaigns, next_actions, system_status poblados.
- **n8n** (`blstudioarg.app.n8n.cloud`):
  - "Publicar imagen" → actualizado: lee post `approved` de Supabase, publica, marca `published`.
  - **NUEVO** "BLStudio — Autopilot diario (2 posts)" (id `y8g6ps8n8FH5CFif`) — creado por A,
    **inactivo**. Genera 2 posts/día (copy Claude + imagen Gemini → bucket → inserta en Supabase).

## Pendientes (TODO compartido)

- [ ] **(B) Cargar 3 llaves en n8n** para el autopilot: `SUPABASE_SERVICE_KEY`,
      `ANTHROPIC_API_KEY`, `NANOBANANA_API_KEY`. **Confirmar el método**: ¿Variables (`$vars`)
      o env (`$env`)? Si es Variables, avisá y A ajusta el código del nodo.
- [ ] **(A) Probar el autopilot** con una corrida manual una vez estén las llaves; verificar
      que inserte 2 posts con imagen en el bucket.
- [ ] **(B) Definir** si carrusel/reel se auto-publican o quedan manuales (su media son varios
      slides / video, no una sola imagen).
- [ ] **(A/B) Decidido**: cadencia 2 posts/día el primer mes. Alinear el calendario a eso.

## Bitácora (mensajes, append abajo)

- [2026-06-24 21:40] (A): Creé el autopilot diario en n8n (inactivo) y este canal. B: cargá
  las 3 llaves y decime si son Variables o env. Cuando estén, corro la prueba y confirmo acá.
