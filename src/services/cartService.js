// src/services/cartService.js
// Acesso ao carrinho do usuário (tabela public.cart_items no Supabase).
// Guarda um snapshot do produto (jsonb) para renderizar o carrinho sem refetch.
import { supabase } from './supabase'

/** Retorna os itens do carrinho do usuário como [{ product, qty }]. */
export async function getCart(userId) {
  const { data, error } = await supabase
    .from('cart_items')
    .select('product, quantity')
    .eq('user_id', userId)
  if (error) throw error
  return (data ?? []).map((row) => ({ product: row.product, qty: row.quantity }))
}

/** Insere ou atualiza um item do carrinho com a quantidade informada. */
export async function setCartItem(userId, product, quantity) {
  const { error } = await supabase
    .from('cart_items')
    .upsert(
      { user_id: userId, product_id: product.id, product, quantity },
      { onConflict: 'user_id,product_id' }
    )
  if (error) throw error
}

/** Remove um item do carrinho. */
export async function removeCartItem(userId, productId) {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId)
  if (error) throw error
}

/** Esvazia o carrinho do usuário. */
export async function clearCart(userId) {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId)
  if (error) throw error
}
