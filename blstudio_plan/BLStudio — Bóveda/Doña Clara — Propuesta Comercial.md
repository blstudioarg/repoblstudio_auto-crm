---
tags:
  - propuesta
  - comercial
  - donaclara
  - pricing
fecha: 2026-06-12
estado: actualizado-2026-06-17
---

# 💼 Doña Clara — Propuesta Comercial

> Tres ofertas para presentar junto con la demo. La primera ancla, la segunda es el punto dulce, la tercera es el sistema completo.

Ver contexto técnico completo: [[Doña Clara]]

---

## 🤝 Política de Entrega — "Contra Conformidad Firmada"

> [!important] Diferencial de confianza (agregar a todas las propuestas futuras)
> El trabajo se da por entregado **solo cuando el cliente firma conformidad**. No se cobra la segunda cuota hasta que el cliente valida el sistema y da el OK formal.

**Cómo funciona:**
- Al entregar el sistema, el cliente lo prueba en condiciones reales (no en demo)
- Si hay algo que no cierra con lo acordado, se ajusta sin costo adicional
- Solo una vez que el cliente firma la conformidad se considera el proyecto entregado y se cobra la última cuota

**Por qué suma:**
- Genera confianza inmediata, especialmente en clientes que nunca contrataron desarrollo web
- Diferencia de "pago y espero" vs "pago cuando estoy conforme"
- Reduce la fricción de cierre — el cliente no siente que está comprando a ciegas
- Aplica a todas las ofertas, no solo a Doña Clara → política general de [[06 - BLStudio Marca]]

> [!tip] Cómo plantearlo en la demo
> "La segunda cuota la pagás cuando el sistema esté funcionando y vos estés conforme. Si algo no está como acordamos, lo ajustamos antes de cerrar. No doy el trabajo por entregado hasta que vos firmés que estás de acuerdo."

---

## 🧠 Estrategia de Presentación

Este cliente tiene caja, quiere algo a medida y valora la calidad. La estrategia es:

1. **Mostrar la demo primero** — que vea el producto funcionando antes de hablar de plata
2. **Presentar la Oferta 1** como "lo mínimo que necesitás para arrancar"
3. **Presentar la Oferta 2** como "lo que realmente querés, y lo que tu negocio merece"
4. El cliente que ya pidió tablet, comandas y MercadoPago va a elegir la 2 solo — no hay que venderla, hay que mostrarla

> [!tip] Psicología de precios (3 planes)
> Oferta 1 ancla hacia abajo (catálogo básico). Oferta 2 es el punto dulce y donde queremos cerrar. Oferta 3 es la aspiracional — quien la elige sabe lo que quiere.

---

## 📦 OFERTA 1 — "Catálogo Base"

**Precio: $975.000 ARS** · 50% inicio / 50% entrega con conformidad firmada
*Incluye: 1er mes de hosting + dominio*

### Qué incluye

| Módulo | Detalle |
|---|---|
| Catálogo web | Menú completo, categorías, fotos, precios |
| Toma de pedidos web | Cliente elige, arma carrito, envía pedido |
| Panel de gestión básico | Toggle disponible/agotado, agregar ítem del día |
| Vista de comandas simple | Lista de pedidos activos (sin tiempo real ni tablet POS) |
| Diseño mobile-first | Responsive en celular y desktop |

### Qué NO incluye
- ❌ MercadoPago
- ❌ Impresión automática de comandas
- ❌ Tablet POS (toma de pedidos presencial en pantalla táctil)
- ❌ Bot de WhatsApp
- ❌ Realtime (cocina recarga para ver nuevos pedidos)

### Para quién es
Para arrancar con presencia digital y dejar de tomar pedidos 100% manual. Útil, pero no es el sistema completo que el negocio necesita.

---

## 🌐 OFERTA 2 — "Web Completa"

**Precio: $1.600.000 ARS** · 50% inicio / 50% entrega con conformidad firmada
*Landing + catálogo + pedidos WhatsApp + MercadoPago web + SEO + dominio + hosting*

| Módulo | Detalle |
|---|---|
| Landing web completa | Historia del negocio, reseñas Google, carta, horarios |
| Catálogo digital | Menú completo, categorías, fotos, precios |
| Pedidos por WhatsApp | Checkout directo al número del local |
| MercadoPago web | Pago online integrado desde el catálogo |
| SEO | Posicionamiento en Google para búsquedas locales en Olavarría |
| Panel admin completo | Toggle stock, ítem del día, historial |
| Dominio + hosting | Incluido el 1er año y mes |

---

## 🚀 OFERTA 3 — "Sistema Gastronómico Completo"

**Precio: $4.550.000 ARS** · 25% inicio / 75% entrega con conformidad firmada

### Qué incluye

| Módulo | Detalle |
|---|---|
| ✅ Todo lo de la Oferta 1 | — |
| **Catálogo premium** | Diseño editorial, animaciones, mobile-first + tablet |
| **Toma de pedidos web** | Con checkout y pago con MercadoPago integrado |
| **Bot de WhatsApp** | Recibe pedidos, confirma, notifica al local y al cliente |
| **Tablet POS presencial** | Tomar pedidos en el local desde pantalla táctil, agregar ítems, cerrar cuenta |
| **Vista de comandas en tiempo real** | Cocina ve pedidos al instante (Supabase Realtime), sin recargar |
| **Pantalla de cocina optimizada para touch** | Botones grandes, diseño oscuro, pensado para tablet en cocina |
| **Impresión automática de comandas** | Al confirmar pedido pago (MercadoPago) → imprime comanda automáticamente |
| **Panel de admin completo** | Stock, menú del día, historial, pedidos por canal, reportes básicos |
| **Diseño tablet-first** | Toda la interfaz interna pensada para tablets con pantalla táctil |

### Flujo completo que se lleva el cliente

```
CANAL WEB:
Cliente entra → elige del catálogo → paga con MercadoPago
→ comanda se imprime automáticamente en cocina
→ cocina la ve en pantalla en tiempo real
→ cambia estado a "listo" → cliente recibe notificación

CANAL WHATSAPP:
Cliente escribe → bot responde con menú → cliente elige
→ pedido entra al sistema → aparece en cocina
→ si paga → imprime comanda; si no → queda pendiente de confirmar

CANAL PRESENCIAL (tablet POS):
Dueño/empleado toma el pedido en la tablet táctil
→ agrega ítems, confirma, imprime comanda
→ cocina lo ve al instante
```

### Detalle técnico de los módulos nuevos vs Oferta 1

#### MercadoPago
- **Pago web:** integración via Checkout Pro (redirect) o Checkout API (in-app)
- **Pago presencial con tarjeta:** integración **Point — modo PDV**. El admin cobra desde el POS, elige "Tarjeta" y la terminal se activa sola por el monto exacto del pedido. La tablet y la terminal hablan por la nube de MP (sin cable). → Detalle: [[Doña Clara — Pagos con Tarjeta (Point)]]
- Webhook de confirmación → dispara la comanda automática
- Solo los pedidos **confirmados y pagados** imprimen comanda
- Pedidos por WhatsApp o presencial: imprimen manual o al confirmar cobro
- Fallback sin terminal: **QR dinámico** (el cliente paga desde el celular)

#### Impresión de Comandas
- Compatible con impresoras térmicas ESC/POS (Epson TM, Star, genéricas)
- El cliente adquiere la impresora (recomendación: Epson TM-T20 o similar ~$80-120 USD)
- El sistema genera el ticket vía protocolo ESC/POS sobre red local (IP fija de la impresora)
- Formato del ticket: número de pedido · canal · ítems + cantidades + notas · hora

#### Tablet POS Presencial
- Interfaz táctil dedicada (botones grandes, sin hover states, sin mouse)
- Búsqueda rápida de ítems por categoría o nombre
- Agregar ítems con un toque, ajustar cantidades
- Nota por ítem ("sin cebolla")
- Cerrar pedido → imprime comanda + notifica cocina
- Mismo sistema que los pedidos web → todo unificado en el panel

---

## 📊 Comparativa de Ofertas

| Feature | Oferta 1 · $900K | Oferta 2 · $4.5M |
|---|:---:|:---:|
| Catálogo web | ✅ | ✅ |
| Toma de pedidos web | ✅ | ✅ |
| Panel de gestión básico | ✅ | ✅ |
| Vista de comandas | básica | ✅ tiempo real |
| Diseño mobile | ✅ | ✅ |
| Diseño tablet-first | — | ✅ |
| MercadoPago | — | ✅ |
| Impresión de comandas | — | ✅ |
| Tablet POS presencial | — | ✅ |
| Bot de WhatsApp | — | ✅ |
| Pantalla de cocina touch | — | ✅ |
| Panel admin completo | — | ✅ |
| Realtime (Supabase) | — | ✅ |

---

## 🎬 Guión de la Demo

### Antes de mostrar precios

1. Abrir el catálogo en el celular → que el cliente navegue él mismo
2. Hacer un pedido de prueba desde el celular
3. Mostrar cómo aparece en la vista de comandas en **tiempo real** (tener la tablet al lado)
4. Cambiar el estado del pedido a "Preparando" → "Listo" desde la tablet
5. Mostrar el toggle de stock → deshabilitar un ítem → que desaparezca del catálogo
6. Agregar un "ítem del día" desde el panel → que aparezca en el catálogo

### Para cerrar la Oferta 2 específicamente

7. Mostrar la **tablet POS**: tomar un pedido presencial con la pantalla táctil
8. Si se puede: mostrar la impresión de comanda (tener impresora conectada o mostrar preview del ticket)
9. Mostrar flujo de WhatsApp: mandar un mensaje → bot responde → pedido aparece en cocina

> [!important] Tip de cierre
> Cuando el cliente vea el tablet POS y la impresora, va a preguntar cuánto cuesta. Ahí presentás las dos ofertas juntas. La Oferta 1 existe para que él mismo descarte y elija la 2.

---

## 🔧 Qué hay que sumar al plan técnico para Oferta 2

Ver [[Doña Clara]] para el plan base. Estos son los módulos extra:

- [ ] **MercadoPago web**: webhook + confirmación de pago + trigger de impresión
- [ ] **MercadoPago Point (cobro tarjeta en mostrador)**: payment-intent a terminal en modo PDV + webhook → ver [[Doña Clara — Pagos con Tarjeta (Point)]]
- [ ] **Impresión ESC/POS**: servicio en Laravel que genera y envía ticket a impresora IP
- [ ] **Tablet POS**: nueva vista React, touch-optimized, sin hover, botones 64px+
- [ ] **Bot WhatsApp**: ya estaba en el plan base ✅

### Estimación de días extra (sobre el plan original de 6 días)
| Módulo extra | Días |
|---|---|
| MercadoPago (Checkout Pro + webhook) | +1 día |
| Impresión ESC/POS | +1 día |
| Tablet POS (nueva vista) | +1.5 días |
| Testing integrado | +0.5 días |
| **Total extra** | **+4 días** |

→ El plan completo para Oferta 2 es de **~10 días** (en lugar de 6).
→ La demo puede mostrar todo igualmente, aunque algunos módulos estén en 70-80%.

---

## 💰 Estructura de Cobro Sugerida

### Oferta 2 — $4.500.000 ARS

| Cuota | Monto | Momento |
|---|---|---|
| 1ra cuota (inicio) | $2.250.000 | Al firmar / aceptar |
| 2da cuota (entrega) | $2.250.000 | Al entregar el sistema funcionando |

> [!note] Mantenimiento futuro (opcional presentar)
> Se puede ofrecer un plan de mantenimiento mensual de $150.000-200.000 ARS que incluya soporte, actualizaciones y hosting. Convierte el proyecto puntual en ingreso recurrente. Ver [[07 - Modelo de negocio]].

---

## 🔗 Conexiones

- Plan técnico completo: [[Doña Clara]]
- Cobro con tarjeta en mostrador: [[Doña Clara — Pagos con Tarjeta (Point)]]
- Cómo encaja en el negocio: [[07 - Modelo de negocio]]
- Para documentar después: [[04 - Casos reales]]
- Contenido que sale de esto: [[09 - Estrategia IG]]
