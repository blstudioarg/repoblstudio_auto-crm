# BLStudio — Mapa del proyecto

> Documento de referencia para entender qué es cada carpeta y qué se limpió. Generado el 2026-06-24, limpieza ejecutada el mismo día. No reemplaza los README de cada subsistema — los enlaza.

---

## 1. Visión general

El repo `blstudio/` mezcla **3 cosas distintas** que conviven en el mismo árbol:

| Carpeta | Qué es | Tamaño en disco |
|---|---|---|
| `blstudio_plan/` | Vault de Obsidian — la estrategia, el brief, las notas de negocio | 356 K |
| `blstudio-ig-system/` | Sistema de generación/publicación de contenido IG (assets, prompts, n8n, render) | 22 M |
| `blstudio-crm/` | El panel de gestión (CRM) — Laravel API + React + Supabase | 133 M (con `vendor/`+`node_modules/`, no versionados) |
| `idea crm contenido/` | 7 imágenes sueltas (capturas de un carrusel de IG de referencia) que ya usé para escribir el backlog del brief | 708 K |
| `.obsidian/` (raíz) | **Huérfano** — config de Obsidian sin notas alrededor | 10 K |

El quilombo no es de tamaño (todo el repo versionado pesa poco), es de **archivos duplicados y carpetas que quedaron de pasos intermedios**.

---

## 2. Duplicados y basura — encontrados y ya eliminados

Verificado con `diff`, `git ls-files` y `git check-ignore` antes de borrar — no fueron suposiciones, fueron hechos.

| # | Qué | Dónde estaba | Evidencia | Estado |
|---|---|---|---|---|
| 1 | `.obsidian/` en la raíz del repo | `/.obsidian/` (3 archivos, 10K) | Sin `community-plugins.json`, sin notas `.md` alrededor. El vault real con plugins completos está en `blstudio_plan/BLStudio — Bóveda/.obsidian/`. Residuo de cuando Obsidian se abrió apuntando a la raíz por error. | ✅ Borrado |
| 2 | 6 archivos `.md` + 1 `.docx` duplicados byte a byte | `blstudio_plan/*.md` (sueltos) vs `blstudio_plan/BLStudio — Bóveda/*.md` | `diff` confirmó **idénticos**: `BLStudio — Panel de gestión CRM.md`, `BLStudio — Narrativa IG julio 2026.md`, `BLStudio — Oferta y lead magnet.md`, `BLStudio — Motor outbound.md`, `BLStudio — Script de cierre.md`, `BLStudio — Ecosistema de adquisición.docx` | ✅ Borradas las copias sueltas de `blstudio_plan/` raíz. El vault (`BLStudio — Bóveda/`) queda como única fuente. |
| 3 | `.pyc` de Python commiteado | `blstudio-ig-system/automation/render/__pycache__/build.cpython-310.pyc` | `git ls-files` lo listaba como trackeado; no estaba en ningún `.gitignore` | ✅ Borrado del repo (`git rm --cached`) + agregado `__pycache__/` y `*.pyc` al `.gitignore` |
| 4 | Sin README en la raíz | `/` | No había ningún punto de entrada que diga "esto es 3 cosas distintas, empezá por X" | ✅ Creado `README.md` |

**Lo que NO es basura aunque parezca:**
- `vendor/` (Laravel) y `node_modules/` (React) en `blstudio-crm/` — pesan 133M juntos pero **no están versionados** (correctamente ignorados). No hay nada que limpiar en git; si querés liberar espacio en disco local, se pueden borrar y se regeneran con `composer install` / `npm install`.
- `database.sqlite` y `.env` en `blstudio-crm-api/` — tampoco versionados, correctamente ignorados.
- `blstudio-ig-system/assets/*` (14M carruseles, 3M historias, 3M reels) — son contenido **ya generado y publicado**, no son clutter, son el archivo histórico de lo posteado.

---

## 3. Decisión tomada: `content/queue/` y `content/calendar/` se borraron

Eran el sistema **original** de planificación de contenido: un JSON por post (`content/queue/*.json`) pensado para completar a mano el nodo "Datos del post" en n8n antes de publicar, más un calendario mensual (`content/calendar/julio-2026.json`). Quedaron redundantes desde que existe el panel CRM — la tabla `posts` en Supabase (vía `Contenido.jsx`) hace lo mismo pero visual, con estados (draft→copy_ready→...→published) y ahora alimentada automáticamente por el autopilot semanal. Confirmado por el usuario y **borrado** (sigue disponible en el historial de git si hace falta recuperarlo).

---

## 4. Recorrido por subsistema

### 4.1 `blstudio_plan/` — Vault de Obsidian (la estrategia)

Vivo: `BLStudio — Bóveda/`. Contiene:
- `00 — Empezar acá.md`, `00 - Quién soy.md`, `00 — Contexto para Cowork.md` → onboarding del vault.
- `01` a `09` → numerados, el cuerpo de la estrategia (producto, modelo de negocio, proyectos activos, estrategia IG).
- `BLStudio — *.md` sueltos (Motor outbound, Oferta, PROJECT BRIEF, Panel de gestión CRM, Plan de desarrollo sistema IG, Plan estratégico gastronomía, Script de cierre) → documentos de trabajo específicos, enlazados entre sí con `[[wikilinks]]`.
- `Doña Clara*.md` → notas de un cliente puntual.

**Acción:** ninguna además de borrar los duplicados de la sección 2. Es el subsistema mejor organizado de los tres.

### 4.2 `blstudio-ig-system/` — Motor de contenido IG

```
assets/        → contenido YA generado (imágenes/carruseles/reels/historias publicados)
automation/    → n8n (workflows), nanobanana (gen. imágenes IA), render (Python/HTML→imagen), meta (config Graph API)
content/       → prompts/ (voz de marca) — calendar/ y queue/ se borraron (sección 3)
design/        → brand/tokens.json + templates/template-ids.json
docs/          → architecture, content-strategy, design-system, meta-api-guide, render-pipeline
```

`content/prompts/master-copy-prompt.md` y `docs/content-strategy.md` son los que usé para el autopilot semanal del CRM — son la fuente de verdad de la voz de marca, no tocar.

### 4.3 `blstudio-crm/` — El panel de gestión

```
blstudio-crm-api/   → Laravel 12 (API, scaffoldeada esta semana)
blstudio-crm-web/   → React + Vite (el panel visual, ya funcionando en modo demo)
supabase/           → schema.sql + seed.sql (Fase 0, listos para correr en Supabase real)
README.md           → estado de las 7 fases del brief
```

Es el subsistema más nuevo y el que menos clutter tiene — recién se terminó de armar. Sin acción de limpieza salvo lo ya cubierto (vendor/node_modules en disco, no en git).

### 4.4 `idea crm contenido/` — Borrada

Eran 7 capturas de un carrusel de IG (@ramiro.cubria) que sirvieron de inspiración para el backlog de mejoras del CRM (Baúl de Ganchos, Métricas, etc.). Su contenido ya estaba absorbido en `blstudio_plan/.../BLStudio — Panel de gestión CRM.md`, así que la carpeta se borró por decisión del usuario.

---

## 5. Estructura final (ya limpia)

```
blstudio/
├── README.md                          ← punto de entrada: qué es cada carpeta
├── MAPA-DEL-PROYECTO.md               ← este archivo
├── blstudio_plan/
│   └── BLStudio — Bóveda/             ← único vault, sin duplicados
├── blstudio-ig-system/
│   ├── assets/
│   ├── automation/                    ← sin __pycache__
│   ├── content/
│   │   └── prompts/                   ← voz de marca (calendar/ y queue/ se borraron)
│   ├── design/
│   └── docs/
└── blstudio-crm/
    ├── blstudio-crm-api/
    ├── blstudio-crm-web/
    └── supabase/
```

## 6. Limpieza ejecutada (2026-06-24)

```bash
rm -rf .obsidian
cd blstudio_plan
rm "BLStudio — Panel de gestión CRM.md" "BLStudio — Narrativa IG julio 2026.md" \
   "BLStudio — Oferta y lead magnet.md" "BLStudio — Motor outbound.md" \
   "BLStudio — Script de cierre.md" "BLStudio — Ecosistema de adquisición.docx"
cd ..
git rm --cached blstudio-ig-system/automation/render/__pycache__/build.cpython-310.pyc
rm -rf blstudio-ig-system/automation/render/__pycache__
rm -rf "idea crm contenido"
rm -rf blstudio-ig-system/content/queue blstudio-ig-system/content/calendar
# + __pycache__/ y *.pyc agregados a .gitignore
```

Resultado: de 289 archivos versionados se eliminaron ~26 (7 duplicados + 12 queue + 1 calendar + 1 pyc + 3 .obsidian + 7 imágenes de referencia... el conteo exacto queda en el commit). Nada se perdió — todo sigue recuperable del historial de git si hace falta.
