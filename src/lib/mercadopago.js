// src/lib/mercadopago.js
// ============================================================
// Utilitário Mercado Pago — SOMENTE FRONTEND (seguro)
// ------------------------------------------------------------
// ⚠️  O Access Token do Mercado Pago é um SEGREDO e NUNCA pode
//     ficar no frontend (qualquer pessoa veria no navegador).
//     Por isso a criação da "preference" (pedido a pagar) é
//     feita no servidor, dentro de uma Supabase Edge Function
//     chamada `create-preference`, que guarda o token com segurança.
//
//     Este arquivo apenas:
//       1. Monta o payload do pedido a partir do carrinho
//       2. Chama a Edge Function
//       3. Devolve a URL `init_point` para redirecionar o usuário
//          ao Checkout Pro hospedado pelo Mercado Pago
//
//     Documentação de deploy da Edge Function:
//       docs/progresso/004_edge_function_create_preference.md
// ============================================================

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
const MP_PUBLIC_KEY = import.meta.env.VITE_MP_PUBLIC_KEY

/** A chave pública pode ser exposta no frontend (usada por Bricks/SDK JS). */
export const mercadoPagoPublicKey = MP_PUBLIC_KEY

/** URL da Edge Function responsável por criar a preference. */
const CREATE_PREFERENCE_URL = SUPABASE_URL
  ? `${SUPABASE_URL}/functions/v1/create-preference`
  : null

/**
 * Converte os itens do carrinho no formato esperado pelo Mercado Pago.
 * @param {Array} items itens do cartStore
 */
function mapItemsToMercadoPago(items) {
  return items.map((item) => ({
    id: String(item.id),
    title: item.title,
    description: [item.selectedSize, item.selectedColor]
      .filter(Boolean)
      .join(' / ') || item.category || undefined,
    picture_url: item.thumbnail,
    category_id: item.category,
    quantity: Number(item.quantity),
    unit_price: Number(item.price),
    currency_id: 'BRL',
  }))
}

/**
 * Cria uma preference de pagamento no Mercado Pago via Edge Function
 * e retorna a URL de checkout (`init_point`).
 *
 * @param {Object} params
 * @param {Array}  params.items     Itens do carrinho
 * @param {Object} params.payer     Dados do comprador { name, surname, email, phone }
 * @param {string} params.externalReference  ID/numero do pedido para conciliação
 * @returns {Promise<{ initPoint: string, preferenceId: string }>}
 */
export async function createPreference({ items, payer, externalReference }) {
  if (!CREATE_PREFERENCE_URL) {
    throw new Error(
      'VITE_SUPABASE_URL não configurada — não é possível criar a preference do Mercado Pago.'
    )
  }
  if (!items?.length) {
    throw new Error('Carrinho vazio: nada para pagar.')
  }

  // URLs de retorno após o pagamento (sucesso / falha / pendente)
  const origin = window.location.origin
  const back_urls = {
    success: `${origin}/pedido-recebido?status=approved&order=${externalReference}`,
    failure: `${origin}/checkout?status=failure`,
    pending: `${origin}/pedido-recebido?status=pending&order=${externalReference}`,
  }

  const body = {
    items: mapItemsToMercadoPago(items),
    payer,
    back_urls,
    external_reference: String(externalReference),
  }

  let response
  try {
    response = await fetch(CREATE_PREFERENCE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Edge Functions do Supabase exigem o anon key por padrão
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify(body),
    })
  } catch (err) {
    throw new Error(
      'Não foi possível contatar o servidor de pagamento. ' +
      'Verifique se a Edge Function `create-preference` está publicada. ' +
      `(${err.message})`
    )
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(
      `Falha ao criar pagamento no Mercado Pago (HTTP ${response.status}). ${detail}`
    )
  }

  const data = await response.json()
  const initPoint = data.init_point || data.sandbox_init_point
  if (!initPoint) {
    throw new Error('A Edge Function não retornou um init_point válido.')
  }

  return { initPoint, preferenceId: data.id ?? data.preference_id ?? null }
}

export default { createPreference, mercadoPagoPublicKey }
