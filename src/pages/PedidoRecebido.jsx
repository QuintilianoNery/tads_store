// src/pages/PedidoRecebido.jsx
import { useEffect, useMemo } from 'react'
import { useLocation, useSearchParams, Link, Navigate } from 'react-router-dom'
import { CheckCircle, Calendar, Mail, CreditCard, Package } from 'lucide-react'
import Button from '@/components/ui/Button/Button'
import useCartStore from '@/store/cartStore'
import { formatPrice, formatDate } from '@/utils/formatters'
import styles from './PedidoRecebido.module.css'

function PedidoRecebido() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const clearCart = useCartStore((s) => s.clearCart)

  // O pedido pode vir de duas formas:
  //  1. Navegação interna (métodos simulados) → location.state.order
  //  2. Retorno do Mercado Pago (redirect) → salvo em sessionStorage
  const order = useMemo(() => {
    if (location.state?.order) return location.state.order
    const saved = sessionStorage.getItem('tads-pending-order')
    return saved ? JSON.parse(saved) : null
  }, [location.state])

  // Status devolvido pelo Mercado Pago (?status=approved|pending|failure)
  const mpStatus = searchParams.get('status')

  // Ao confirmar o pedido, esvazia o carrinho e limpa o pedido pendente
  useEffect(() => {
    if (order && mpStatus !== 'failure') {
      clearCart()
      sessionStorage.removeItem('tads-pending-order')
    }
  }, [order, mpStatus, clearCart])

  // Sem pedido em lugar nenhum, redireciona
  if (!order) return <Navigate to="/" replace />

  const { number, date, items, total, payment, address } = order

  const paymentLabel = {
    mercadopago: 'Mercado Pago',
    transfer: 'Transferência bancária',
    check:    'Cheque',
    delivery: 'Pagamento na entrega',
  }[payment] ?? payment

  return (
    <div className={styles.page}>
      <div className="container">
        {/* ── Header de confirmação ── */}
        <div className={styles.hero}>
          <div className={styles.heroIcon} aria-hidden="true">
            <CheckCircle size={48} />
          </div>
          <h1 className={styles.heroTitle}>Pedido Recebido!</h1>
          <p className={styles.heroDesc}>
            Obrigado! Seu pedido foi recebido com sucesso.
          </p>
        </div>

        {/* ── Resumo rápido ── */}
        <dl className={styles.summary}>
          <div className={styles.summaryItem}>
            <Package size={18} className={styles.summaryIcon} aria-hidden="true" />
            <dt className={styles.summaryLabel}>Número do pedido</dt>
            <dd className={styles.summaryValue}>#{number}</dd>
          </div>
          <div className={styles.summaryItem}>
            <Calendar size={18} className={styles.summaryIcon} aria-hidden="true" />
            <dt className={styles.summaryLabel}>Data</dt>
            <dd className={styles.summaryValue}>{formatDate(date)}</dd>
          </div>
          <div className={styles.summaryItem}>
            <Mail size={18} className={styles.summaryIcon} aria-hidden="true" />
            <dt className={styles.summaryLabel}>E-mail</dt>
            <dd className={styles.summaryValue}>{address.email}</dd>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryIcon} aria-hidden="true">R$</span>
            <dt className={styles.summaryLabel}>Total</dt>
            <dd className={styles.summaryValue}>{formatPrice(total)}</dd>
          </div>
          <div className={styles.summaryItem}>
            <CreditCard size={18} className={styles.summaryIcon} aria-hidden="true" />
            <dt className={styles.summaryLabel}>Pagamento</dt>
            <dd className={styles.summaryValue}>{paymentLabel}</dd>
          </div>
        </dl>

        {mpStatus === 'pending' && (
          <p className={styles.paymentNote}>
            Seu pagamento está <strong>pendente de confirmação</strong> (PIX ou boleto).
            Assim que o Mercado Pago confirmar, seu pedido <strong>#{number}</strong> será
            processado.
          </p>
        )}
        {payment === 'delivery' && (
          <p className={styles.paymentNote}>Pagar em dinheiro na entrega.</p>
        )}
        {payment === 'transfer' && (
          <p className={styles.paymentNote}>
            Faça seu pagamento diretamente em nossa conta bancária. Informe o número
            do pedido <strong>#{number}</strong> como identificação do depósito ou
            transferência.
          </p>
        )}

        <div className={styles.grid}>
          {/* ── Detalhes do pedido ── */}
          <section aria-labelledby="order-details-heading">
            <h2 id="order-details-heading" className={styles.sectionTitle}>
              Detalhes do pedido
            </h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th className={styles.thRight}>Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={`${item.id}-${item.selectedSize}`}>
                    <td>
                      {item.title}
                      {item.selectedSize && ` — ${item.selectedSize}`} × {item.quantity}
                    </td>
                    <td className={styles.tdRight}>
                      {formatPrice(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td>Subtotal:</td>
                  <td className={styles.tdRight}>{formatPrice(total)}</td>
                </tr>
                <tr>
                  <td>Método de pagamento:</td>
                  <td className={styles.tdRight}>{paymentLabel}</td>
                </tr>
                <tr className={styles.totalRow}>
                  <td>Total:</td>
                  <td className={styles.tdRight}>{formatPrice(total)}</td>
                </tr>
              </tfoot>
            </table>
          </section>

          {/* ── Endereço de faturamento ── */}
          <section aria-labelledby="billing-heading">
            <h2 id="billing-heading" className={styles.sectionTitle}>
              Endereço de faturamento
            </h2>
            <address className={styles.addressCard}>
              <p>{address.firstName} {address.lastName}</p>
              {address.company && <p>{address.company}</p>}
              <p>{address.address}{address.number ? `, ${address.number}` : ''}</p>
              <p>{address.city} — {address.state}</p>
              <p>{address.country}</p>
              <p>{address.cep}</p>
              {address.phone && (
                <p>
                  <a href={`tel:${address.phone}`}>{address.phone}</a>
                </p>
              )}
              <p>
                <a href={`mailto:${address.email}`}>{address.email}</a>
              </p>
            </address>
          </section>
        </div>

        {/* ── CTAs ── */}
        <div className={styles.ctas}>
          <Link to="/produtos">
            <Button variant="primary" size="lg">Continuar comprando</Button>
          </Link>
          <Link to="/minha-conta/pedidos">
            <Button variant="secondary" size="lg">Ver meus pedidos</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PedidoRecebido
