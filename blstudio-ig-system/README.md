# blstudio-ig-system

Sistema de producción y publicación de contenido para Instagram (@blstudioarg2026) de BLStudio. Convierte la estrategia de contenido en posts reales de forma semi-automatizada: **Claude genera → Juan aprueba → n8n publica via Meta Graph API**.

La fuente de verdad es el **PROJECT BRIEF** en la bóveda de Obsidian (`BLStudio — Bóveda/BLStudio — PROJECT BRIEF.md`). Esta carpeta es la implementación.

## Estructura

```
blstudio-ig-system/
├── docs/            ← arquitectura, design system, estrategia, guía Meta
├── design/          ← brand tokens + referencia de templates de Canva
├── content/         ← prompts, calendario mensual, queue de posts
└── automation/      ← workflows de n8n + config de Meta
```

## Cómo se usa (flujo semanal)

1. Nueva sesión de Cowork. Prompt: *"Generar los 3 posts de la semana N del calendario julio-2026.json"*.
2. Claude genera los JSON (en `content/queue/`) y arma/exporta los visuales.
3. Juan revisa caption + imagen y aprueba.
4. Se publican con los workflows de `automation/n8n/` (manual por ahora; automático en Fase 7).

## Estado de las fases

| Fase | Qué | Estado |
|---|---|---|
| 0 | Setup Meta + n8n + Canva | ⏳ Manual (tuyo) — requiere cuentas/tokens |
| 1 | Estructura + design system | ✅ Hecha |
| 2 | Templates de Canva | ➖ Reemplazada por HTML (Carrusel Studio) |
| 3 | Primer post end-to-end | ◐ Carrusel del miércoles (sem 1) hecho con imágenes IA |
| 4 | Workflows n8n (imagen, carrusel, reel) | ✅ Hechos |
| 5 | Batch semanal | ✅ Mes completo: 12 posts (copy) en `content/queue/` |
| 6 | Imágenes IA (NanoBanana) | ✅ Integrada en `automation/nanobanana/` (probada) |
| 7 | Trigger automático | ✅ Template `workflow-weekly-trigger.json` |

## 