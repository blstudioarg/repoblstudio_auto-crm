---
tags:
  - donaclara
  - pagos
  - mercadopago
  - point
  - oferta-2
  - tecnico
fecha: 2026-06-13
estado: investigado-pendiente-implementar
modulo: cobro-presencial-tarjeta
---

# 💳 Doña Clara — Cobro con Tarjeta en Mostrador (Mercado Pago Point)

> Módulo de la [[Doña Clara — Propuesta Comercial#🚀 OFERTA 2 — "Sistema Gastronómico Completo"|Oferta 2]]. Cobrar con tarjeta en el mostrador desde el mismo POS, atado al pedido. El monto viaja solo a la terminal y el lector se activa solo.

Contexto técnico del proyecto: [[Doña Clara]] · Plan: `doñaclara/PLAN_PROYECTO.md`

---

## 🧠 La idea en una línea

El admin arma un pedido de $40.000 en el [[Doña Clara#📋 Módulos|Tablet POS]], toca **Cobrar → Tarjeta**, y la terminal Mercado Pago Point se activa sola pidiendo ese monto exacto. El cliente apoya la tarjeta, MP confirma, y el pedido queda pagado e impreso. Cero tipeo, cero error de monto.

> [!info] El producto existe y es oficial
> Se llama **Point — Integración PDV** (*Point Integration API*). Es la forma oficial de conectar un sistema propio a las terminales de Mercado Pago.

---

## 🔄 Cómo funciona realmente (flujo del mostrador)

```
1. Admin arma el pedido en /pos        → total exacto $40.000
2. Toca "Cobrar" → elige "Tarjeta"
3. Backend crea una payment-intent      → manda el monto a la terminal por su device_id
4. La terminal se DESPIERTA              → muestra $40.000 + activa el lector
5. El cliente apoya/inserta la tarjeta   → (PIN si corresponde) — lo hace la persona
6. MP procesa y avisa por WEBHOOK        → pedido pasa a "pagado"
7. Se imprime la comanda + entra a cocina
```

> [!important] Qué significa "automático"
> El **monto se envía solo** (atado al pedido, no se tipea) y la **confirmación vuelve sola** (webhook → marca pagado → imprime). Lo único manual es que el cliente apoya su tarjeta en la terminal. El operador no toca números.

---

## 🔌 El punto clave: NO van cableadas

La tablet y la terminal **no se conectan por cable**. Las dos están online y asociadas a la **misma cuenta de Mercado Pago del cliente**. El POS le habla a la terminal por su `device_id` **a través de la nube de MP**.

```
[Tablet POS] → [Backend Laravel] → [Nube MP] → [Terminal Point] ⇄ [Cliente/tarjeta]
                                       ↑                              |
                                       └──────── webhook ─────────────┘
```

Requisito: la terminal tiene que estar en **modo PDV** (Punto de Venta). Solo se permite **un dispositivo en modo PDV por caja**.

---

## 🖥️ La "segunda pantalla" (lado cliente)

La imagen de la terminal táctil de **doble pantalla** (operador de un lado, cliente del otro) encaja perfecto:

- **Doble pantalla:** la cara del cliente muestra el pedido + total mientras el admin opera del otro lado.
- **Point Smart al lado:** el cliente ve el monto en la pantalla de la propia terminal.

La vista detallada para el cliente es una pantalla extra que construimos — parte del módulo POS tablet-first.

---

## 🛠️ Dos formas de armar el hardware

| | Opción A — Terminal al lado | Opción B — Todo en la Point Smart |
|---|---|---|
| **Cómo** | Point Pro 2 / Smart como lector, integrada por **Point Integration API** (REST) | La app corre en la Point Smart (Android) con el **SDK Android de Point** |
| **Front** | Calza con el POS web actual, sin reescribir | Requiere build nativo |
| **Complejidad** | Baja ✅ | Alta (hardware certificado) |
| **Recomendado** | ✅ Sí para Doña Clara | Solo si quieren un único equipo todo-en-uno |

---

## 💸 Alternativa más barata — QR dinámico

Si el cliente no quiere terminal: el POS genera un **QR por el monto** (Orders API / QR in-store) y el cliente paga desde su celular. Cero hardware extra, misma confirmación por webhook. Buen fallback y escalón intermedio para la demo.

---

## ⚠️ Letra chica (para no prometer de más)

- **Cuenta MP del cliente** con la terminal activada y en modo PDV.
- **Credenciales:** se opera con las del cliente (igual que el cobro web). Multi-cliente → conviene **OAuth** en vez de token crudo.
- **Modelos:** por API → Point Pro 1 / Pro 2. Point Smart → por SDK. Confirmar el modelo antes de cotizar.
- **Comisión por transacción** de MP (varía por plan y plazo de acreditación) → costo del cliente, hay que decírselo.
- **Online sí o sí:** sin internet en la terminal no hay cobro integrado.
- **Producción:** MP suele revisar/habilitar la integración Point antes de ir a real (hay sandbox).
- MP suma estados `pending` / `cancelled` (ya en Brasil, **próximamente Argentina**) → el webhook tiene que contemplarlos.

---

## 💼 Por qué importa comercialmente

Esto refuerza directo la [[Doña Clara — Propuesta Comercial|Oferta 2]] (que ya incluye "MercadoPago + Tablet POS"). Pasás de *"cobrás por la web"* a **"cobrás con tarjeta en el mostrador desde la misma tablet"** — un argumento de venta mucho más fuerte, y un diferencial real frente a un POS genérico. Encaja con la lógica de [[07 - Modelo de negocio]]: lo que se resuelve acá es módulo reutilizable para cualquier cocina con volumen.

---

## ✅ Hecho en la demo (frontend / mock)

- [x] **Flujo de cobro en el POS** — botón `Cobrar` abre selección de método: **Tarjeta / QR / Efectivo**.
- [x] **Mock de terminal Mercado Pago Point** — secuencia animada: conectando → esperando tarjeta (tarjeta + ondas NFC) → leyendo → procesando → **aprobado** con recibo (medio, cód. autorización, ID de operación).
- [x] **Sellos de seguridad** — candado "Seguro", "Cifrado de extremo a extremo", "Transacción protegida", + tag honesto **"SIMULACIÓN"** (no cobra de verdad).
- [x] **Efectivo** con calculadora de vuelto · **QR** dinámico simulado.
- [x] Campos de pago en el pedido (Zustand): `payment_method`, `payment_status`, `mp_payment_id`, `paid_at`.
- 📁 `web/src/components/PaymentSheet.jsx` · `web/src/pages/POS.jsx` · `web/src/store/useStore.js`

## 📋 Pendientes técnicos (para el backend real)

- [ ] Reemplazar la simulación por la **Point Integration API** real (payment-intent → terminal en modo PDV)
- [ ] Endpoints: `POST /orders/{id}/charge-card`, `GET /orders/{id}/payment`, `DELETE /orders/{id}/charge-card`, `POST /mp/point/webhook`
- [ ] Persistir `mp_device_id` + estado real del cobro en la tabla `orders`
- [ ] Webhook que marca pagado + dispara impresión de comanda
- [ ] Confirmar con el cliente: ¿ya tienen terminal Point? ¿qué modelo? ¿cuenta MP activa?

---

## 🔗 Conexiones

- Proyecto: [[Doña Clara]]
- Propuesta: [[Doña Clara — Propuesta Comercial]]
- Daily: [[2026-06-13]]
- Modelo de negocio: [[07 - Modelo de negocio]]

## 📚 Fuentes (docs oficiales MP)

- [Point — Integrar con PDV (intro)](https://www.mercadopago.com.ar/developers/es/docs/mp-point/integration-configuration/integrate-with-pdv/introduction)
- [Point — Configurar dispositivos en modo PDV](https://www.mercadopago.com.br/developers/es/docs/mp-point/integration-configuration/integrate-with-pdv/configure-devices)
- [Point — Integrar el procesamiento de pagos](https://www.mercadopago.com.ar/developers/es/docs/mp-point/payment-processing)
- [API Reference — crear payment-intent en un device](https://www.mercadopago.com.mx/developers/es/reference/integrations_api/_point_integration-api_devices_deviceid_payment-intents/post)
- [API Reference — actualizar operation mode (PDV)](https://www.mercadopago.com.ar/developers/es/reference/in-person-payments/point/terminals/update-operation-mode/patch)
