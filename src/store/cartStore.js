// src/store/cartStore.js
// Estado global do carrinho de compras com persistência em localStorage
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
  persist(
    (set, get) => ({
      // ─── Estado ───────────────────────────────────────────────
      items: [], // { id, title, price, thumbnail, quantity, selectedSize, selectedColor }

      // ─── Computed (getters) ───────────────────────────────────

      /** Total de itens (soma das quantities) */
      totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      /** Valor total do carrinho */
      totalPrice: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

      /** Verifica se um produto está no carrinho */
      isInCart: (productId) => get().items.some((item) => item.id === productId),

      // ─── Actions ──────────────────────────────────────────────

      /** Adiciona produto ou incrementa quantidade se já existir */
      addItem: (product, quantity = 1, options = {}) => {
        const { items } = get()
        const key = buildItemKey(product.id, options)
        const existing = items.find((i) => buildItemKey(i.id, i) === key)

        if (existing) {
          set({
            items: items.map((i) =>
              buildItemKey(i.id, i) === key
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          })
        } else {
          set({
            items: [
              ...items,
              {
                id: product.id,
                title: product.title,
                price: getDiscountedPrice(product),
                originalPrice: product.price,
                thumbnail: product.thumbnail,
                category: product.category,
                quantity,
                selectedSize: options.size ?? null,
                selectedColor: options.color ?? null,
              },
            ],
          })
        }
      },

      /** Remove um item do carrinho pelo ID */
      removeItem: (productId, options = {}) => {
        const key = buildItemKey(productId, options)
        set({
          items: get().items.filter((i) => buildItemKey(i.id, i) !== key),
        })
      },

      /** Atualiza a quantidade de um item */
      updateQuantity: (productId, quantity, options = {}) => {
        if (quantity <= 0) {
          get().removeItem(productId, options)
          return
        }
        const key = buildItemKey(productId, options)
        set({
          items: get().items.map((i) =>
            buildItemKey(i.id, i) === key ? { ...i, quantity } : i
          ),
        })
      },

      /** Esvazia o carrinho */
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'tads-store-cart',
    }
  )
)

// Chave única por produto + variação
function buildItemKey(id, options) {
  return `${id}-${options.selectedSize ?? ''}-${options.selectedColor ?? ''}`
}

// Aplica desconto se houver
function getDiscountedPrice(product) {
  if (!product.discountPercentage) return product.price
  return +(product.price * (1 - product.discountPercentage / 100)).toFixed(2)
}

export default useCartStore
