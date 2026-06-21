// api/_lib/mpSignature.js
// ============================================================
// Verificação da assinatura (x-signature) das notificações do Mercado Pago.
// Pasta `_lib` (prefixo _) não vira rota na Vercel — é só código compartilhado.
//
// O Mercado Pago assina cada webhook. Montamos o "manifesto"
//   id:<data.id>;request-id:<x-request-id>;ts:<ts>;
// e comparamos o HMAC-SHA256 (com o secret do webhook) ao valor `v1` do header
// `x-signature` (formato: "ts=...,v1=..."). Isso garante que a notificação
// veio mesmo do Mercado Pago, e não de um terceiro.
// ============================================================
import crypto from 'node:crypto';

/** Faz o parse do header `x-signature` ("ts=...,v1=...") em { ts, v1 }. */
export function parseSignature(header) {
  const parts = {};
  for (const piece of String(header || '').split(',')) {
    const idx = piece.indexOf('=');
    if (idx === -1) continue;
    const key = piece.slice(0, idx).trim();
    const val = piece.slice(idx + 1).trim();
    if (key) parts[key] = val;
  }
  return parts;
}

/**
 * Verifica a assinatura `x-signature` de um webhook do Mercado Pago.
 * @param {object} params
 * @param {string} params.signatureHeader - header `x-signature`.
 * @param {string} params.requestId - header `x-request-id`.
 * @param {string|number} params.dataId - id do recurso (query `data.id`).
 * @param {string} params.secret - segredo de assinatura do webhook (MP_WEBHOOK_SECRET).
 * @returns {boolean} true se a assinatura confere.
 */
export function verifyMercadoPagoSignature({ signatureHeader, requestId, dataId, secret }) {
  if (!signatureHeader || !secret) return false;
  const { ts, v1 } = parseSignature(signatureHeader);
  if (!ts || !v1) return false;

  const manifest = `id:${String(dataId ?? '').toLowerCase()};request-id:${requestId ?? ''};ts:${ts};`;
  const expected = crypto.createHmac('sha256', secret).update(manifest).digest('hex');

  // Comparação em tempo constante (evita timing attack); tamanhos diferentes → falso.
  let a;
  let b;
  try {
    a = Buffer.from(expected, 'hex');
    b = Buffer.from(v1, 'hex');
  } catch {
    return false;
  }
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
