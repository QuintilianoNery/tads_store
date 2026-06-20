// src/lib/mercadopago.js
// ============================================================
// Utilitário Mercado Pago — SOMENTE FRONTEND (seguro)
// ------------------------------------------------------------
// ⚠️  O Access Token do Mercado Pago é um SEGREDO e NUNCA pode
//     ficar no frontend (qualquer pessoa veria no navegador).
//     Por isso a criação da "preference" (pedido a pagar) é feita
//     no servidor, na função serverless `api/create-preference.js`
//     (Vercel/Node), que guarda o token com segurança.
//
//     Este arquivo apenas:
//       1. Mapeia os itens do carrinho ({ product, qty }) para o
//          formato do Mercado Pago;
//       2. Chama a função `/api/create-preference` (mesma origem);
//       3. Devolve a URL `init_point` para redirecionar o usuário
//          ao Checkout Pro (fluxo de redirect).
//
//     Backend: api/create-preference.js · docs/progresso/004.
// ============================================================
import { finalPrice } from '@/lib/format';

/** Endpoint da função serverless (mesma origem — Vercel serve /api). */
const CREATE_PREFERENCE_URL = '/api/create-preference';

/**
 * Converte os itens do carrinho ({ product, qty }) no formato do Mercado Pago.
 * Usa o preço final (com desconto) como unit_price, em BRL (reais, não centavos).
 */
function mapItemsToMercadoPago(items) {
  return items.map(({ product, qty }) => ({
    id: String(product.id),
    title: product.title,
    description: product.category || undefined,
    picture_url: product.thumbnail,
    category_id: product.category,
    quantity: Number(qty),
    unit_price: finalPrice(product),
    currency_id: 'BRL',
  }));
}

/**
 * Monta as URLs de retorno do Checkout Pro.
 * O Mercado Pago RECUSA back_urls em domínios locais (localhost/127.0.0.1) —
 * causaria "Algo deu errado" na volta. Então em dev local devolvemos undefined
 * (o retorno automático só é testável no deploy https da Vercel).
 * As três URLs apontam para a MESMA página; o `status` real vem na query que o
 * Mercado Pago anexa na volta (não o chumbamos aqui).
 */
function buildBackUrls() {
  const { origin, hostname } = window.location;
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
  if (isLocal) return undefined;
  const returnUrl = `${origin}/pedido-recebido`;
  return { success: returnUrl, failure: returnUrl, pending: returnUrl };
}

/**
 * Cria uma preference de pagamento no Mercado Pago (via função serverless)
 * e retorna a URL de checkout (`init_point`) para redirecionar o comprador.
 *
 * @param {Object} params
 * @param {Array}  params.items              Itens do carrinho [{ product, qty }]
 * @param {Object} [params.payer]            Dados do comprador { name, surname, email }
 * @param {string} params.externalReference  Número do pedido (conciliação)
 * @param {number} [params.shipmentCost]     Frete em reais (adicionado ao total)
 * @returns {Promise<{ initPoint: string, preferenceId: string|null }>}
 */
export async function createPreference({ items, payer, externalReference, shipmentCost = 0 }) {
  if (!items?.length) {
    throw new Error('Carrinho vazio: nada para pagar.');
  }

  const body = {
    items: mapItemsToMercadoPago(items),
    payer,
    back_urls: buildBackUrls(),
    external_reference: String(externalReference),
  };

  // Frete entra como custo de envio (soma ao total da preference no Mercado Pago).
  if (shipmentCost > 0) {
    body.shipments = { cost: Number(shipmentCost), mode: 'not_specified' };
  }

  let response;
  try {
    response = await fetch(CREATE_PREFERENCE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (err) {
    throw new Error(
      'Não foi possível contatar o servidor de pagamento. ' +
      'Em desenvolvimento, a função /api só roda com `vercel dev` (não no `npm run dev`). ' +
      `(${err.message})`
    );
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(
      `Falha ao criar pagamento no Mercado Pago (HTTP ${response.status}). ${detail}`
    );
  }

  const data = await response.json();
  const initPoint = data.init_point || data.sandbox_init_point;
  if (!initPoint) {
    throw new Error('A resposta não trouxe um init_point válido.');
  }

  return { initPoint, preferenceId: data.id ?? null };
}

export default { createPreference };
