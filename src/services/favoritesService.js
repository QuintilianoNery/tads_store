// src/services/favoritesService.js
// Acesso aos favoritos do usuário (tabela public.favorites no Supabase).
import { supabase } from './supabase'

/** Retorna os product_ids favoritados pelo usuário. */
export async function getFavorites(userId) {
  const { data, error } = await supabase
    .from('favorites')
    .select('product_id')
    .eq('user_id', userId)
  if (error) throw error
  return (data ?? []).map((row) => row.product_id)
}

/** Adiciona um produto aos favoritos. Ignora duplicatas (unique violation). */
export async function addFavorite(userId, productId) {
  const { error } = await supabase
    .from('favorites')
    .insert({ user_id: userId, product_id: productId })
  // 23505 = unique_violation (já está favoritado) — não é erro para nós.
  if (error && error.code !== '23505') throw error
}

/** Remove um produto dos favoritos. */
export async function removeFavorite(userId, productId) {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId)
  if (error) throw error
}
