// src/lib/orderNumber.js — número de pedido legível (sem dependências).

/** Número de pedido legível derivado do id (uuid) — ex.: TADS-A1B2C3. */
export function orderNumber(order) {
  return 'TADS-' + String(order?.id ?? '').replace(/-/g, '').slice(0, 6).toUpperCase();
}
