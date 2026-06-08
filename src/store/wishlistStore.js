// src/store/wishlistStore.js
// Estado global da lista de desejos com persistência
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useWishlistStore = create(
  persist(
    (set, get) => ({
      // ─── Estado ───────────────────────────────────────────────
      items: [], // Product[]

      // ─── Computed ─────────────────────────────────────────────
      totalItems: () => get().items.length,
      isWishlisted: (productId) => get().items.some((i) => i.id === productId),

      // ─── Actions ──────────────────────────────────────────────

      /** Adiciona produto à wishlist (ignora duplicatas) */
      addItem: (product) => {
        if (get().isWishlisted(product.id)) return
        set({ items: [...get().items, product] })
      },

      /** Remove produto da wishlist */
      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.id !== productId) })
      },

      /** Toggle: adiciona se não estiver, remove se estiver */
      toggle: (product) => {
        if (get().isWishlisted(product.id)) {
          get().removeItem(product.id)
        } else {
          get().addItem(product)
        }
      },

      /** Esvazia a wishlist */
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'tads-store-wishlist',
    }
  )
)

export default useWishlistStore
