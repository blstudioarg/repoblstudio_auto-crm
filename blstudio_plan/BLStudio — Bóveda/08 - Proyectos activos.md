# 08 - Proyectos activos

## TCocina ⭐ (piloto del SaaS)
**Qué es**: hamburguesería artesanal smash en Olavarría. App web de pedidos + CRM + cocina en producción.
**Estado**: en producción, clientes reales, creciendo. Tomas (dueño) tiene picos de 150 burgers el domingo.
**Stack**: Laravel 12, Blade, TailwindCSS v4, MySQL
**Carpeta**: `Cowork_claude/tcocina/13-5-26`
**IG**: @t_cocina_ | Web: tcocina.org

### En progreso — Rediseño landing tcocina.org
- Landing nueva casi terminada (`_landing_preview/index.html`)
- Hero: reemplazar escena flotante por imagen cinematográfica con temática mundialista
  - Imagen: burger real de TCocina en contexto urbano BsAs (Obelisco, murales Maradona/Messi/Dibu)
  - 3 estrellas doradas + 1 estrella vacía (alusión al 4to mundial)
  - Confetti celeste y blanco
  - **Prompt generado** → generar en ChatGPT con la foto de burger como referencia
- Logo en header: Tc=celeste, o=blanco, c=dorado, i=blanco, na=celeste (edición mundialista)
- Falta: menú hamburguesa mobile
- **Próximo paso**: mostrarle a Tomas la landing como upgrade sorpresa → cobrar

---

---

## Doña Clara 🍗 ✅ VENDIDO — en producción
**Qué es**: Casa de comidas familiar tradicional en Olavarría (Dorrego y Lavalle). Alto volumen, todo manual hasta ahora. Necesitan digitalizar la toma de pedidos.
**Estado**: 🟢 **CERRADO 2026-06-18** — en camino a producción
**Valor**: $2.000.000 ARS — $1M cobrado en 2 días · $1M contra entrega
**Stack**: React + Vite + Tailwind (frontend estático actual en producción) · Laravel 11 + Supabase Realtime (backend pendiente)
**Carpeta**: `Cowork_claude/doñaclara` · Proyecto de producción: `web_FINAL`
**Módulos**: Catálogo web · Vista de comandas (tablet) · Panel admin · POS · Bot WhatsApp (Twilio)
**Nota completa**: [[Doña Clara]]
**Tipo**: proyecto de agencia → ingreso directo + caso de éxito futuro + prueba de expansión del SaaS a casas de comidas

> [!tip] Conexión con TCocina
> La arquitectura es muy similar a TCocina. Reusar lógica de comandas y pedidos. Lo que se construya acá puede alimentar al [[03 - Mi producto|SaaS]].

---

## La Ventera
**Qué es**: distribuidora de aceite para gastronomía (proveedor de Tomas). Web institucional.
**Estado**: en desarrollo
**Carpeta**: `Cowork_claude/La Ventera Aceite`

---

## Panchería
**Estado**: en desarrollo
**Carpeta**: `Cowork_claude/pancheria`

---

## Otros proyectos (en carpeta raíz Proyectos)
- Empresa de arquitectura — web entregada
- Varios más en distintas etapas

---

## 📅 Daily Logs

- [[2026-06-13]]
- [[2026-06-16]]
- [[2026-06-17]]
- [[2026-06-18]]
- [[2026-06-19]]
- [[2026-06-20]]
- [[2026-06-21]]
- [[2026-06-22]]
- [[2026-06-23]]

---

## TCocina como caso de venta
Una vez entregado el rediseño → documentar como caso de éxito → contenido para [[09 - Estrategia IG]] → argumento de cierre para nuevos cliente