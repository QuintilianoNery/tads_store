// src/components/product/ProdutoCard/ProdutoCard.jsx
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart } from 'lucide-react'
import Badge from '@/components/ui/Badge/Badge'
import StarRating from '@/components/ui/StarRating/StarRating'
import useCartStore from '@/store/cartStore'
import useWishlistStore from '@/store/wishlistStore'
import { formatPrice, calcDiscountedPrice } from '@/utils/formatters'
import styles from './ProdutoCard.module.css'

/**
 * Card de produto reutilizável.
 * Recebe o objeto produto da DummyJSON e expõe ações de carrinho e wishlist.
 */
function ProdutoCard({ produto }) {
  const { id, title, price, discountPercentage, rating, thumbnail, category } = produto

  const addToCart = useCartStore((s) => s.addItem)
  const { toggle, isWishlisted } = useWishlistStore()

  const finalPrice = calcDiscountedPrice(price, discountPercentage)
  const isOnSale = discountPercentage > 0
  const wishlisted = isWishlisted(id)

  function handleAddToCart(e) {
    e.preventDefault()
    addToCart(produto)
  }

  function handleToggleWishlist(e) {
    e.preventDefault()
    toggle(produto)
  }

  return (
    <article className={styles.card}>
      <Link to={`/produto/${id}`} className={styles.imageWrapper} tabIndex={-1} aria-hidden="true">
        <img
          src={thumbnail}
          alt={title}
          className={styles.image}
          loading="lazy"
        />

        {isOnSale && (
          <Badge variant="danger" size="sm" className={styles.saleBadge}>
            -{Math.round(discountPercentage)}%
          </Badge>
        )}

        {/* Ações no hover */}
        <div className={styles.actions} role="group" aria-label="Ações do produto">
          <button
            className={`${styles.actionBtn} ${wishlisted ? styles.wishlisted : ''}`}
            onClick={handleToggleWishlist}
            aria-label={wishlisted ? 'Remover da lista de desejos' : 'Adicionar à lista de desejos'}
            title={wishlisted ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
          </button>
          <button
            className={styles.actionBtn}
            onClick={handleAddToCart}
            aria-label={`Adicionar ${title} ao carrinho`}
            title="Adicionar ao carrinho"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </Link>

      <div className={styles.info}>
        <span className={styles.category}>{category}</span>

        <Link to={`/produto/${id}`} className={styles.titleLink}>
          <h3 className={styles.title}>{title}</h3>
        </Link>

        <StarRating rating={rating} size={13} />

        <div className={styles.pricing}>
          <span className={styles.price}>{formatPrice(finalPrice)}</span>
          {isOnSale && (
            <span className={styles.originalPrice}>{formatPrice(price)}</span>
          )}
        </div>
      </div>
    </article>
  )
}

export default ProdutoCard
