// src/services/reviewService.js
// Acesso às avaliações de produtos (tabela public.reviews no Supabase).
// Sem moderação: toda avaliação criada aparece publicamente de imediato.
import { supabase } from './supabase'

/**
 * Lista as avaliações de um produto (mais recentes primeiro). Públicas.
 * @param {number} productId
 * @returns {Promise<object[]>}
 */
export async function getProductReviews(productId) {
  const { data, error } = await supabase
    .from('reviews')
    .select('id, rating, comment, author_name, created_at')
    .eq('product_id', productId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

/**
 * Lista as avaliações do próprio usuário, para sabermos quais produtos ele já
 * avaliou e poder editar.
 * @param {string} userId
 * @returns {Promise<object[]>}
 */
export async function getUserReviews(userId) {
  const { data, error } = await supabase
    .from('reviews')
    .select('id, product_id, rating, comment, created_at')
    .eq('user_id', userId)
  if (error) throw error
  return data ?? []
}

/**
 * Cria ou atualiza a avaliação do usuário para um produto (uma por produto).
 * @param {object} params
 * @param {string} params.userId
 * @param {number} params.productId
 * @param {string|null} [params.orderId]
 * @param {number} params.rating - 1 a 5
 * @param {string} [params.comment]
 * @param {string} [params.authorName]
 * @returns {Promise<object>} A avaliação criada/atualizada.
 */
export async function upsertReview({ userId, productId, orderId = null, rating, comment = '', authorName = '' }) {
  const { data, error } = await supabase
    .from('reviews')
    .upsert(
      {
        user_id: userId,
        product_id: productId,
        order_id: orderId,
        rating,
        comment,
        author_name: authorName,
      },
      { onConflict: 'user_id,product_id' }
    )
    .select()
    .single()
  if (error) throw error
  return data
}
