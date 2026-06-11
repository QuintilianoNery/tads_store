// src/pages/Carrinho.jsx
import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import Button from '@/components/ui/Button/Button'
import useCartStore from '@/store/cartStore'
import { formatPrice } from '@/utils/formatters'
import styles from './Carrinho.module.css'

function Carrinho() {
  const items        = useCartStore((s) => s.items)
  const updateQty    = useCartStore((s) => s.updateQuantity)
  const removeItem   = useCartStore((s) => s.removeItem)
  const totalPrice   = useCartStore((s) => s.totalPrice)

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <ShoppingBag size={64} className={styles.emptyIcon} aria-hidden="true" />
        <h2 className={styles.emptyTitle}>Seu carrinho está vazio</h2>
        <p className={styles.emptyDesc}>Explore nosso catálogo e adicione produtos que você gostar.</p>
        <Link to="/produtos">
          <Button variant="primary" size="lg">Ver produtos</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.pageTitle}>Carrinho</h1>

        <div className={styles.layout}>
          {/* ── Tabela de itens ── */}
          <section aria-label="Itens do carrinho">
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col" className={styles.thImg}>Imagem</th>
                  <th scope="col">Produto</th>
                  <th scope="col" className={styles.thRight}>Preço</th>
                  <th scope="col" className={styles.thCenter}>Qtd.</th>
                  <th scope="col" className={styles.thRight}>Total</th>
                  <th scope="col" className={styles.thCenter}>Remover</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const itemKey = `${item.id}-${item.selectedSize}-${item.selectedColor}`
                  const lineTotal = item.price * item.quantity

                  return (
                    <tr key={itemKey}>
                      <td>
                        <Link to={`/produto/${item.id}`}>
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className={styles.itemImg}
                          />
                        </Link>
                      </td>
                      <td className={styles.tdProduct}>
                        <Link to={`/produto/${item.id}`} className={styles.itemName}>
                          {item.title}
                        </Link>
                        {(item.selectedSize || item.selectedColor) && (
                          <span className={styles.itemVariant}>
                            {[item.selectedSize, item.selectedColor].filter(Boolean).join(' · ')}
                          </span>
                        )}
                      </td>
                      <td className={styles.tdRight}>
                        <span className={styles.price}>{formatPrice(item.price)}</span>
                      </td>
                      <td className={styles.tdCenter}>
                        <div className={styles.qtyControl}>
                          <button
                            className={styles.qtyBtn}
                            onClick={() => updateQty(item.id, item.quantity - 1, item)}
                            aria-label="Diminuir quantidade"
                          >
                            <Minus size={14} />
                          </button>
                          <span className={styles.qtyVal} aria-live="polite">{item.quantity}</span>
                          <button
                            className={styles.qtyBtn}
                            onClick={() => updateQty(item.id, item.quantity + 1, item)}
                            aria-label="Aumentar quantidade"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </td>
                      <td className={styles.tdRight}>
                        <span className={styles.lineTotal}>{formatPrice(lineTotal)}</span>
                      </td>
                      <td className={styles.tdCenter}>
                        <button
                          className={styles.removeBtn}
                          onClick={() => removeItem(item.id, item)}
                          aria-label={`Remover ${item.title} do carrinho`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </section>

          {/* ── Resumo ── */}
          <aside className={styles.summary} aria-label="Resumo do pedido">
            <h2 className={styles.summaryTitle}>Total no carrinho</h2>

            <dl className={styles.summaryRows}>
              <dt>Subtotal</dt>
              <dd>{formatPrice(totalPrice())}</dd>
              <dt className={styles.totalLabel}>Total</dt>
              <dd className={styles.totalValue}>{formatPrice(totalPrice())}</dd>
            </dl>

            <Link to="/checkout">
              <Button variant="primary" size="lg" fullWidth>
                Concluir compra <ArrowRight size={18} aria-hidden="true" />
              </Button>
            </Link>

            <Link to="/produtos" className={styles.continueShopping}>
              ← Continuar comprando
            </Link>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default Carrinho
