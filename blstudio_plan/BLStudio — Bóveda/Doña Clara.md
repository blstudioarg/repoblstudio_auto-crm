---
tags:
  - proyecto
  - cliente
  - gastronomia
  - en-curso
  - agencia
estado: frontend-completo-backend-pendiente
cliente: Doña Clara — Casa de Comidas
tipo: agencia
fecha_inicio: 2026-06-12
ultima_actualizacion: 2026-06-14
stack: Laravel · React · Supabase
frontend_status: ✅ completo (mock data) + pulido visual WOW
backend_status: ⏳ pospuesto (post-venta)
---

# 🍗 Doña Clara — Casa de Comidas

> *Rosticería familiar con muchos años, clientela grande y alto flujo de pedidos. Hasta ahora todo manual. Vamos a cambiar eso.*

> [!info] Contexto del proyecto
> Trabajo de [[07 - Modelo de negocio#El modelo de agencia (ingreso paralelo)|agencia]] — ingreso directo. Pero la arquitectura (pedidos + comandas + WhatsApp) es casi la misma que el [[03 - Mi producto|SaaS]]. Lo que aprendamos acá expande el producto más allá de las hamburgerías. Ver [[08 - Proyectos activos]] para el contexto completo.

## 📍 Info del Negocio

| | |
|---|---|
| **Nombre** | Doña Clara — Rotisería / Casa de Comidas |
| **Dirección** | Dorrego y Lavalle, Olavarría (B7400) |
| **Teléfono** | 02284 41-7820 *(el 550615 del brief no aparece en fuentes públicas)* |
| **WhatsApp** | 2284-691782 *(delivery, según Linktree)* |
| **Google** | ⭐ **4,5 · 317 reseñas** · takeaway · $5.000-20.000/persona · domingos cerrado |
| **Instagram** | [@_donaclara](https://www.instagram.com/_donaclara/) (~1.440) · tagline *"El sabor de siempre, hecho con…"* |
| **Facebook** | [Rotisería Doña Clara](https://www.facebook.com/p/Rotiseria-Do%C3%B1a-Clara-100063605225737/) (~682 likes) |
| **Promo** | 10% de descuento pagando en efectivo *(verificar vigencia)* |
| **Canales actuales** | Presencial + WhatsApp manual |

> [!note] Datos de Google verificados (2026-06-14)
> Capturados de la ficha real de Google Maps. **OJO:** los "7.9" que aparecen en buscadores son de otros "Doña Clara" homónimos (Sevilla, Tenerife, etc.) — no son este local.

---

## 🎯 Objetivo del Proyecto

Digitalizar la operación completa:

1. **Catálogo web** hermoso para que el cliente haga el pedido
2. **Vista de comandas** en tiempo real para cocina (tablet)
3. **Panel admin** para gestionar stock y menú del día
4. **Bot de WhatsApp** que recibe pedidos y notifica al local

> [!important] Demo esta semana
> El cliente tiene que ver el flujo completo funcionando: pedido web → cocina en tiempo real + bot de WhatsApp recibiendo un pedido.

---

## 🛠️ Stack

| Capa | Tech |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Laravel 11 (API REST) |
| Base de datos | Supabase (PostgreSQL) |
| Real-time | Supabase Realtime (websockets) |
| WhatsApp | Twilio Sandbox → Meta Cloud API |
| Deploy demo | Railway (Laravel) + Vercel (React) |

> [!tip] Por qué Supabase Realtime
> La vista de comandas necesita actualizarse sin que la cocina recargue la página. Supabase Realtime resuelve esto con websockets sin tener que configurar nada extra en el servidor.

---

## 🎨 Identidad Visual

### Paleta de Colores

| Token | Hex | Uso |
|---|---|---|
| `--primary` | `#00503C` | Verde logo — headers, botones |
| `--primary-dark` | `#14503C` | Hover, navbar |
| `--primary-light` | `#E8F5F0` | Fondos suaves, chips |
| `--accent` | `#DCB478` | Dorado terracota — precios, highlights |
| `--accent-dark` | `#B8914A` | Hover del dorado |
| `--cream` | `#FDF8F3` | Fondo general |
| `--dark` | `#141414` | Fondo comandas/cocina |
| `--danger` | `#C0392B` | Agotado, cancelado |

> [!note] Origen de la paleta
> Extraída directamente del logo (verde bosque circular) y del frente del local (chapa oscura + paredes terracota/dorado cálido).

### Tipografía

- **Display/Títulos:** Playfair Display 700 italic — evoca el script del logo
- **Cuerpo/UI:** Inter 400/500/600
- Ambas en Google Fonts, cero costo

### Estilo por Vista

- **Catálogo (cliente):** fondo crema `#FDF8F3`, tarjetas blancas, precios en dorado
- **Comandas (cocina):** fondo oscuro `#141414`, texto grande, botones 48px mínimo
- **Admin:** gris claro funcional, toggle verde/gris para disponibilidad

---

## 📋 Módulos

### 1. Catálogo del Cliente `/`
- Categorías + ítems disponibles
- Ítems del día destacados con badge ⭐
- Agotados al 50% con badge rojo
- Carrito flotante → checkout → mensaje WhatsApp prellenado

### 2. Vista Comandas `/cocina`
- Kanban: Pendiente → Preparando → Listo
- Actualización en tiempo real (Supabase Realtime)
- Alerta visual/sonora en pedido nuevo
- Diseñado para tablet en cocina

### 3. Panel Admin `/admin`
- Toggle disponible/agotado con 1 click
- Agregar ítem del día rápido
- Vista de pedidos del día por canal (web / WhatsApp / local)

### 4. Bot WhatsApp
- Cliente escribe → recibe menú del día
- Selecciona ítems → bot confirma y crea pedido en sistema
- Pedido aparece en comandas igual que uno web
- Notificación automática "Tu pedido está listo" 🟢

### 5. Cobro con Tarjeta en Mostrador (Mercado Pago Point) `Oferta 2`
- El admin cobra desde el POS → elige **Tarjeta** → la terminal Point se activa sola por el monto exacto del pedido
- Integración oficial **Point — modo PDV** (la tablet y la terminal hablan por la nube de MP, sin cable)
- Confirmación por webhook → marca pagado → dispara impresión de comanda
- Fallback sin terminal: **QR dinámico** (paga desde el celular)
- → Detalle completo: [[Doña Clara — Pagos con Tarjeta (Point)]]

---

## 🍽️ Menú Real

### Menú Semanal (rotativo)

| Día | Platos |
|---|---|
| **Lunes** | Pechugas a la plancha · Guiso de fideos · Tarta de jamón, queso y tomate |
| **Martes** | Panaché de verduras · Guiso de arroz · Pan de carne · Albóndigas con arroz |
| **Miércoles** | Pastel de papas · Mondongo a la española · Milanesa de berenjena con puré mixto |
| **Jueves** | Carré de cerdo al verdeo · Tarta de calabaza · Bocadillos de acelga · Risotto · Tarta de zapallitos · Guiso de lentejas |
| **Viernes** | Calabaza rellena · Zapallitos rellenos · Milanesa de pescado · Puré de zapallo |
| **Sábado** | Lasagna de J&Q · Peceto a la riojana · Bondiola con papas · Chorizos · Costillas de cerdo |

### Carta Fija

**Pastas:** Sorrentinos · Canelones · Ñoquis · Tallarines · Ravioles (verdura/ricota/pollo)
*Salsas:* Bolognesa · Filetto · Mixta · Blanca · Crema

**Carnes:** Matambre a la pizza · Bife de chorizo · Peceto · Colita de cuadril mechada · Pollo arrollado/espiedo · Pata muslo · Milanesas · Hamburguesas

**Ensaladas:** Lentejas · Rusa · Primavera · Mayonesa de ave · Remolacha y huevo · Tomates cherry · Arroz con atún · Calamares · Porotos pallares · Repollo · César · Mediterránea · **Doña Clara** ⭐ · Caramel

**Entradas:** Vitel toné · Lengua a la vinagreta · Pollo al escabeche · Mondongo al escabeche

**Tartas y Masas:** Calzones · Tarteletas · Tartas · Empanadas · Pizzas

**Guarniciones:** Papas al horno/fritas · Puré de papa/calabaza · Tortillas (papa · espinaca · cebolla y morrón) · Tomates rellenos · Piononos · Torre de fiambres · Berenjenas al escabeche

---

## 🔗 Conexiones Estratégicas

- **Proyecto referencia de cocina**: [[08 - Proyectos activos#TCocina ⭐ (piloto del SaaS)]] — ya resolvimos el stack, la vista de cocina y los pedidos ahí. Doña Clara hereda ese aprendizaje.
- **Modelo de ingreso**: proyecto de [[07 - Modelo de negocio#El modelo de agencia (ingreso paralelo)|agencia]] que financia mientras crece el SaaS.
- **Caso de éxito futuro**: una vez entregado → documentar en [[04 - Casos reales]] → contenido para [[09 - Estrategia IG]].
- **Expansión del SaaS**: Doña Clara demuestra que el sistema no es solo para hamburgerías. Proof of concept para casas de comidas, rotiserías, restós simples → nuevo segmento. Ver [[03 - Mi producto]].

---

## 📅 Plan de la Semana

```
Día 1 — Base Laravel + Supabase + Migraciones + Seeders
Día 2 — Frontend React: Catálogo + Carrito + Checkout
Día 3 — Comandas en tiempo real (Supabase Realtime)
Día 4 — Panel Admin: stock toggle + ítem del día
Día 5 — WhatsApp bot (Twilio Sandbox)
Día 6 — Polish, deploy, testing completo
```

> [!check] Criterio de éxito de la demo
> 1. Cliente pide desde el celular → aparece en comandas en < 2 segundos
> 2. Dueño deshabilita un ítem en 1 click → desaparece del catálogo
> 3. Mensaje de WhatsApp → bot responde con menú → pedido aparece en cocina

---

## ❓ Decisiones Pendientes (confirmar con cliente)

- [ ] ¿Pedidos web son delivery o también retiro en el local?
- [ ] ¿El número de WhatsApp actual del local se usa para el bot o usan uno nuevo?
- [ ] ¿Tienen fotos de los platos para el catálogo?
- [ ] ¿El catálogo requiere login para hacer pedido o es abierto?
- [ ] ¿Necesitan facturación/caja o solo gestión de pedidos?
- [ ] ¿Ya tienen terminal Mercado Pago Point? ¿Qué modelo (Pro 2 / Smart)? — ver [[Doña Clara — Pagos con Tarjeta (Point)]]

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

## 💼 Propuesta Comercial

→ [[Doña Clara — Propuesta Comercial]] — dos ofertas, pricing, guión de demo y módulos extra para el sistema completo.

---

## 🎬 Pulido visual para la demo (2026-06-14)

> [!important] Decisión: backend pospuesto
> El cliente priorizó que la demo sea **estéticamente impecable y fluida** (WOW en todo) por sobre el backend. Supabase/Laravel quedan para **después de cerrar la venta**. Esta sesión fue 100% detalle visual y UX.

**Hecho y verificado en navegador:**

- 🖼️ **Hero del landing** — las fotos ya no se cortan detrás de la tarjeta blanca; encuadre corregido (frente del local sin techo, mostrador con bandejas visibles); fallback verde marca. La foto del mostrador en "Nosotros" pasa a `contain` para verse completa.
- 🧮 **Calculadora del POS** (`CashKeypad.jsx`, nueva 3ª columna) — patrón de las terminales reales (Toast/Square): **modo Cobro** (Total/Recibido/Vuelto en vivo + montos rápidos dinámicos calculados desde el total) y **modo Calc** (calculadora aritmética real `+ − × ÷ =`).
- 📜 **Carta scroll-scan** (landing público) — **todas cerradas por defecto**; al bajar se abre **una categoría a la vez** cerrando la anterior (efecto escaneo), con anti-salto, click/teclado para fijar y cards que entran escalonadas. **Descripción debajo del título**. (Se eliminó un acordeón viejo inline que rompía el comportamiento.)
- 💳 **Cobro más cinematográfico** — los estados de la terminal hacen cross-fade (ya no saltan), botones de método escalonados, **barra de progreso** en la terminal (15→100%), "¡Pago aprobado!" en cascada. Bug arreglado: el feedback táctil de los botones (`active:scale-98`) no hacía nada → ahora sí.
- 🍳 **Cocina sin "teletransporte"** — las comandas entran con animación al cambiar de columna, destello al cambiar de estado y **salen deslizando** al entregar/cancelar.
- 🎉 **Overlay de éxito del POS** — el número de pedido entra en cascada (badge → número → texto → chip de pago).
- ♿ **Repaso UI/UX** (skill ui-ux-pro-max) — caret de los `<select>` con padding propio (chevron SVG, ya no pegado al borde), focus-rings accesibles, `aria-label` en inputs/selects, emojis reemplazados por íconos SVG.

- ⭐ **Nueva sección "Reseñas de Google"** (landing, `#resenas`) — investigada con un agente + captura de la ficha real de Google Maps. Sello de Google a color con **4,5★ · 317 reseñas**, **marquee auto-scroll** de reseñas verbatim reales (Natalia M., Ricardo M., Mario S., Ramiro L. + anónimas), chips de fortalezas (porciones abundantes · variedad · precio justo · atención · comida fresca) y CTA "Ver todas en Google". Solo datos reales, nada inventado.

### Reseñas reales usadas (verbatim de Google)
- *"La comida más rica de Olavarría: variedad de menú, limpieza, buen personal y precios accesibles."* — Natalia M.
- *"¡Excelente calidad de comida y excelsa atención!"* — Ricardo M.
- *"Buena comida y buen precio, muy variadas opciones."* — Mario S.
- *"Excelente atención y buena comida."* — Ramiro L.
- *"Muy buena rotisería. Excelente atención, porciones abundantes y sabrosísimas, muchísima variedad y precios accesibles…"*
- *"Platos variados y muy buenos precios. ¡Muy conforme estoy!"* · *"Muy ricas empanadas, buena atención."* · *"Llevamos tartas individuales de verduras y pollo y estaban sabrosas."*

> [!todo] Pendiente para enriquecer
> Capturar más reseñas 5★ (scroll del panel de Maps), fotos reales de platos del Instagram, y horarios completos confirmados por el dueño.

> [!note] Archivos clave de esta fase
> Público (estático): `web/index.html`, `web/public/assets/app.js` (`initCartaScan`), `web/public/assets/styles.css`. Staff (React): `web/src/components/CashKeypad.jsx` (nuevo), `PaymentSheet.jsx`, `pages/POS.jsx`, `pages/Kitchen.jsx`, `components/OrderCard.jsx`, `pages/Admin.jsx`, `src/index.css`.
> ⚠️ `pages/Catalog.jsx`, `components/Cart.jsx` y `components/ModifierSheet.jsx` (React) quedaron **legacy** tras el split multi-page — el catálogo público real es el estático.

---

## ✅ Estado del Frontend (2026-06-13)

Todo el frontend corre en mock data (Zustand store). El backend Laravel y Supabase son el siguiente paso.

| Vista | Ruta | Estado | Descripción |
|---|---|---|---|
| Catálogo público | `/` | ✅ completo | Hero animado, modificadores, search, upsell, WhatsApp |
| Comandas cocina | `/cocina` | ✅ completo | Kanban real-time, alertas, Supabase-ready |
| Panel admin | `/admin` | ✅ completo | Toggle stock, ítem del día, pedidos por canal |
| Tablet POS | `/pos` | ✅ completo | Split layout + **cobro** (tarjeta/QR/efectivo + mock terminal Point), success overlay, WOW |

---

## 🔍 Research: Mejores POS del Mundo (ya implementado)

Investigación sobre Toast, Square, TouchBistro, Lightspeed, SpotOn (2026).

**Resultado:** el frontend está al nivel de los mejores. Las 3 features clave del research ya están implementadas:

1. ✅ **Modificadores** — `ModifierSheet.jsx` se abre al tocar pastas → "¿Qué salsa?" [Bolognesa/Filetto/Mixta/Blanca/Crema]. La selección queda como chip dorado en el carrito y en el mensaje de WhatsApp.
2. ✅ **Search bar** — toggle en el tab bar, filtra en tiempo real sobre toda la carta
3. ✅ **Upsell de guarnición** — toast no-invasivo 4s después de agregar un principal (se omite si ya hay guarnición)

**Pendiente para producción:**
- Descuento % en POS (botón en panel de orden)
- Badge de pedidos pendientes en header del POS

> Ver análisis completo: `doñaclara/PLAN_PROYECTO.md` → "Research: Mejores Apps POS del Mercado"

---

## 📁 Archivos del Proyecto

### Documentación
- `doñaclara/PLAN_PROYECTO.md` — plan técnico completo: DB schema, endpoints, paleta, menú real, análisis de mercado
- `doñaclara/PROMPT_CLAUDE_DESIGN.md` — prompt para ejecutar en Claude Design (catálogo público, ya ejecutado)
- `doñaclara/PROMPT_CLAUDE_POS.md` — prompt de diseño para el Tablet POS
- `doñaclara/CONTEXTO_HANDOFF.md` — **leer primero al abrir en Claude Code** — estado completo del proyecto

### Frontend (`web/src/`)
- `pages/Catalog.jsx` — catálogo público completo con hero, modificadores, search, upsell
- `pages/POS.jsx` — Tablet POS (el WOW de la demo)
- `pages/Kitchen.jsx` — comandas en tiempo real
- `pages/Admin.jsx` — panel de administración
- `components/ModifierSheet.jsx` — bottom sheet de opciones (salsas para pastas, etc.)
- `components/PaymentSheet.jsx` — flujo de cobro del POS: método (tarjeta/QR/efectivo) + mock de terminal Mercado Pago Point → ver [[Doña Clara — Pagos con Tarjeta (Point)]]
- `components/Cart.jsx` — carrito con doble checkout: WhatsApp + sistema
- `components/MenuCard.jsx` — tarjeta de ítem (en Catalog, la versión inline tiene tapped state)
- `store/useStore.js` — Zustand store (single source of truth)
- `data/menu.js` — menú real completo con precios ARS
- `lib/format.js` — `money()`, `timeAgo()`, `STATUS_LABEL`

### Backend (⏳ pendiente)
- `api/` — Laravel 11 por crear
- Supabase project por crear
- Twilio Sandbox por configurar

> [!tip] Para la demo
> 1. `cd doñaclara/web && npm run dev`
> 2. Abrí `/pos` en la tablet del cliente → el WOW que cierra la venta
> 3. Abrí `/cocina` en otra pantalla → los pedidos del POS aparecen en tiempo real
> 4. Abrí `/` en el celular → el catálogo con modificadores de salsa

> [!warning] Sin backend, el estado dura solo mientras la pestaña está abierta. Para la demo, no recargar páginas.

---

## 🌐 Landing Web Estática (2026-06-14)

> [!info] Dos proyectos separados
> - **`web/src/`** → React app (POS, Cocina, Admin, Catálogo) — la demo para el cliente
> - **`web/index.html` + `web/public/assets/`** → Landing pública (HTML/CSS/JS vanilla) — lo que verá el consumidor final

### ⚠️ PedidosYa = COMPETENCIA

> [!danger] NO incluir PedidosYa en ningún lado
> La razón por la que este cliente nos contrató es exactamente para **dejar de depender de PedidosYa**. PedidosYa cobra comisiones altas y se lleva una porción del ingreso. El objetivo de la web es que los clientes pidan directo por WhatsApp. Nunca agregar, linkear ni mencionar PedidosYa en la landing ni en la app.

### Cambios aplicados en la landing

**Identidad de marca:**
- Hero lede con slogan real: *"El sabor de siempre, hecho con amor."* + descripción real (Dorrego y Lavalle, pollo al spiedo, pastas del día, empanadas)
- About section reescrita con historia auténtica (1991, esquina de Dorrego y Lavalle, "el lugar donde Olavarría viene a buscar el sabor de casa")
- Métricas reales: +33 años · 317★ · 4,5★
- Reviews header: *"Lo dicen ellos, no nosotros"* / *"317 reseñas en Google. 4,5 estrellas. Más de 30 años cocinando."*

**Diferenciador directo:**
- Badge añadido en sección "Cómo pedir": *"Pedido directo a nosotros · sin comisiones · sin aplicaciones"*
- CTA principal: "Pedir por WhatsApp" — siempre visible, siempre primero

**Sección de reseñas — card stack animado:**
- Reemplazó el marquee por un **deck de tarjetas apiladas** (estilo CodePen shshaw/KzYXvP)
- Auto-avance cada 3,5 segundos
- Swipe/touch para mobile
- Dots indicadores + botones prev/next
- Logo Google SVG (`<symbol>` + `<use>`) en cada card
- 8 reseñas reales con nombre, estrellas y texto verbatim

**Horarios corregidos (doble turno real):**
```js
const HOURS = {
  1:[[11.5,14],[19.5,23]], // L-V: mediodía + noche
  2:[[11.5,14],[19.5,23]],
  3:[[11.5,14],[19.5,23]],
  4:[[11.5,14],[19.5,23]],
  5:[[11.5,14],[19.5,23]],
  6:[[11.5,14]],           // Sábado: solo mediodía
  0:null                   // Domingo: cerrado
};
```

### Archivos clave (landing estática)
- `web/index.html` — toda la estructura HTML
- `web/public/assets/styles.css` — card stack CSS + directo-badge + horarios
- `web/public/assets/app.js` — `HOURS`, `liveStatus()`, `initReviews()` (card stack logic)

---

## 🔗 Links Útiles

- [Supabase Dashboard](https://supabase.com)
- [Railway Deploy](https://railway.app)
- [Vercel](https://vercel.com)
- [Twilio WhatsApp Sandbox](https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn)
- [Google Fonts — Playfair Display](https://fonts.google.com/specimen/P