// src/pages/ListaDesejos.jsx
import { Link } from 'react-router-dom'
import { X, ShoppingCart, Heart } from 'lucide-react'
import Button from '@/components/ui/Button/Button'
import useWishlistStore from '@/store/wishlistStore'
import useCartStore from '@/store/cartStore'
import { formatPrice } from '@/utils/formatters'
import styles from './ListaDesejos.module.css'

function ListaDesejos() {
  const items      = useWishlistStore((s) => s.items)
  const removeItem = useWishlistStore((s) => s.removeItem)
  const addToCart  = useCartStore((s) => s.addItem)

  function handleMoveToCart(product) {
    addToCart(product)
    removeItem(product.id)
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.pageTitle}>Lista de Desejos</h1>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <Heart size={64} className={styles.emptyIcon} aria-hidden="true" />
            <h2 className={styles.emptyTitle}>Sua lista está vazia</h2>
            <p className={styles.emptyDesc}>
              Adicione produtos que você ama para salvá-los aqui.
            </p>
            <Link to="/produtos">
              <Button variant="primary" size="lg">Explorar produtos</Button>
            </Link>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col" className={styles.thImg}></th>
                <th scope="col">Nome do produto</th>
                <th scope="col" className={styles.thRight}>Preço unit.</th>
                <th scope="col" className={styles.thCenter}>Estoque</th>
                <th scope="col" className={styles.thCenter}>Adicionar ao carrinho</th>
                <th scope="col" className={styles.thCenter}>Remover</th>
              </tr>
            </thead>
            <tbody>
              {items.map((product) => (
                <tr key={product.id}>
                  <td>
                    <Link to={`/produto/${product.id}`}>
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className={styles.productImg}
                      />
                    </Link>
                  </td>
                  <td>
                    <Link to={`/produto/${product.id}`} className={styles.productName}>
                      {product.title}
                    </Link>
                  </td>
                  <td className={styles.tdRight}>
                    <span className={styles.price}>{formatPrice(product.price)}</span>
                  </td>
                  <td className={styles.tdCenter}>
                    {product.stock > 0 ? (
                      <span className={styles.inStock}>Em estoque</span>
                    ) : (
                      <span className={styles.outStock}>Esgotado</span>
                    )}
                  </td>
                  <td className={styles.tdCenter}>
                    <button
                      className={styles.cartBtn}
                      onClick={() => handleMoveToCart(product)}
                      disabled={product.stock === 0}
                      aria-label={`Adicionar ${product.title} ao carrinho`}
                    >
                      <ShoppingCart size={16} aria-hidden="true" />
                      Adicionar
                    </button>
                  </td>
                  <td className={styles.tdCenter}>
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeItem(product.id)}
                      aria-label={`Remover ${product.title} da lista de desejos`}
                    >
                      <X size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default ListaDesejos
