// src/components/cart/MiniCart/MiniCart.jsx
import { Link } from 'react-router-dom'
import { X, ShoppingBag } from 'lucide-react'
import Button from '@/components/ui/Button/Button'
import useCartStore from '@/store/cartStore'
import { formatPrice } from '@/utils/formatters'
import styles from './MiniCart.module.css'

function MiniCart({ onClose }) {
  const items = useCartStore((s) => s.items)
  const totalPrice = useCartStore((s) => s.totalPrice)
  const removeItem = useCartStore((s) => s.removeItem)

  if (items.length === 0) {
    return (
      <div className={styles.miniCart} role="dialog" aria-label="Carrinho de compras">
        <div className={styles.empty}>
          <ShoppingBag size={40} className={styles.emptyIcon} aria-hidden="true" />
          <p>Seu carrinho está vazio.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.miniCart} role="dialog" aria-label="Carrinho de compras">
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className={styles.item}>
            <img src={item.thumbnail} alt={item.title} className={styles.itemImage} />
            <div className={styles.itemInfo}>
              <span className={styles.itemTitle}>{item.title}</span>
              {item.selectedSize && (
                <span className={styles.itemVariant}>Tam: {item.selectedSize}</span>
              )}
              <span className={styles.itemQtyPrice}>
                {item.quantity} × {formatPrice(item.price)}
              </span>
            </div>
            <button
              className={styles.removeBtn}
              onClick={() => removeItem(item.id, item)}
              aria-label={`Remover ${item.title} do carrinho`}
            >
              <X size={14} />
            </button>
          </li>
        ))}
      </ul>

      <div className={styles.subtotal}>
        <span>Subtotal:</span>
        <strong>{formatPrice(totalPrice())}</strong>
      </div>

      <div className={styles.footer}>
        <Link to="/carrinho" onClick={onClose}>
          <Button variant="secondary" fullWidth size="sm">Ver Carrinho</Button>
        </Link>
        <Link to="/checkout" onClick={onClose}>
          <Button variant="primary" fullWidth size="sm">Checkout</Button>
        </Link>
      </div>
    </div>
  )
}

export default MiniCart
