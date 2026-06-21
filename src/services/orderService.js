// src/services/orderService.js
// Camada de acesso aos pedidos do usuário (tabelas public.orders e
// public.order_items). Cada pedido guarda um snapshot dos itens e do endereço
// de entrega para o histórico ser exibido sem depender de refetch.
import { supabase } from './supabase'
import { finalPrice } from '@/lib/format'
import { orderNumber } from '@/lib/orderNumber'

// Re-exporta o formatador puro para os consumidores que já importam daqui.
export { orderNumber }

/**
 * Cria um pedido com seus itens.
 * @param {object} params
 * @param {string} params.userId
 * @param {{ product: object, qty: number }[]} params.items
 * @param {number} params.subtotal
 * @param {number} params.total
 * @param {string} params.paymentMethod - ex.: 'mercadopago'
 * @param {object} params.address - Endereço de entrega (snapshot, jsonb)
 * @param {string} [params.status='pago'] - 'pendente' enquanto aguarda o pagamento.
 * @param {string} [params.mpPreferenceId] - id da preference do Mercado Pago.
 * @returns {Promise<object>} O pedido criado (com order_items).
 */
export async function createOrder({ userId, items, subtotal, total, paymentMethod, address, status = 'pago', mpPreferenceId = null }) {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      status,
      subtotal,
      total,
      payment_method: paymentMethod,
      billing_address: address ?? null,
      mp_preference_id: mpPreferenceId,
    })
    .select()
    .single()
  if (orderError) throw orderError

  const rows = items.map(({ product, qty }) => ({
    order_id: order.id,
    product_id: product.id,
    product_title: product.title,
    product_thumbnail: product.thumbnail,
    quantity: qty,
    unit_price: finalPrice(product),
    total_price: +(finalPrice(product) * qty).toFixed(2),
  }))

  const { data: orderItems, error: itemsError } = await supabase
    .from('order_items')
    .insert(rows)
    .select()
  if (itemsError) throw itemsError

  return { ...order, order_items: orderItems }
}

/** Vincula a preference do Mercado Pago a um pedido já criado. */
export async function setOrderPreference(orderId, mpPreferenceId) {
  const { error } = await supabase
    .from('orders')
    .update({ mp_preference_id: mpPreferenceId })
    .eq('id', orderId)
  if (error) throw error
}

/** Busca um pedido (com itens) por id — usado no polling da tela de retorno. */
export async function getOrderById(orderId) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', orderId)
    .single()
  if (error) throw error
  return data
}

/**
 * Marca um pedido como pago (transição pendente → pago). Idempotente: só altera
 * se ainda estiver 'pendente'. Usado como fallback do cliente no retorno; a
 * confirmação canônica é o webhook (servidor). O dono pode atualizar o próprio
 * pedido (RLS), então roda com a sessão do usuário.
 * @returns {Promise<object|null>} o pedido atualizado, ou null se já não estava pendente.
 */
export async function markOrderPaid(orderId) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status: 'pago' })
    .eq('id', orderId)
    .eq('status', 'pendente')
    .select()
    .maybeSingle()
  if (error) throw error
  return data
}

/**
 * Soma quanto o usuário já comprou de cada produto (apenas pedidos **pagos**).
 * Usado para descontar do estoque-base da API — a DummyJSON é mock e não
 * persiste escritas, então a fonte de verdade da baixa são os pedidos pagos
 * (pedidos 'pendente' aguardando pagamento não consomem estoque).
 * @param {string} userId
 * @returns {Promise<Record<number, number>>} { [productId]: quantidadeTotal }
 */
export async function getStockConsumption(userId) {
  const { data, error } = await supabase
    .from('order_items')
    .select('product_id, quantity, orders!inner(user_id, status)')
    .eq('orders.user_id', userId)
    .eq('orders.status', 'pago')
  if (error) throw error

  const consumed = {}
  for (const row of data ?? []) {
    consumed[row.product_id] = (consumed[row.product_id] || 0) + (row.quantity || 0)
  }
  return consumed
}

/**
 * Lista os pedidos do usuário (mais recentes primeiro), com seus itens.
 * @param {string} userId
 * @returns {Promise<object[]>}
 */
export async function getOrders(userId) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}
