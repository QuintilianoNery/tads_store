// src/pages/conta/Pedidos.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye } from 'lucide-react'
import { formatPrice, formatDate } from '@/utils/formatters'
import styles from './ContaPages.module.css'

// Dados simulados — em produção viria do Supabase
const MOCK_PEDIDOS = [
  { id: 8547, date: '2026-05-07', status: 'Aguardando', total: 804.75, items: 12 },
  { id: 6694, date: '2026-05-06', status: 'Enviado',    total: 666.75, items: 10 },
  { id: 6693, date: '2026-05-06', status: 'Entregue',   total: 199.90, items: 3  },
  { id: 6692, date: '2026-05-05', status: 'Entregue',   total: 349.90, items: 5  },
]

const STATUS_VARIANT = {
  Aguardando: styles.statusPending,
  Enviado:    styles.statusShipped,
  Entregue:   styles.statusDelivered,
  Cancelado:  styles.statusCancelled,
}

function Pedidos() {
  const [page, setPage] = useState(1)
  const perPage  = 5
  const total    = MOCK_PEDIDOS.length
  const pedidos  = MOCK_PEDIDOS.slice((page - 1) * perPage, page * perPage)
  const hasNext  = page * perPage < total

  return (
    <div>
      <h2 className={styles.sectionTitle}>Pedidos</h2>

      {pedidos.length === 0 ? (
        <p className={styles.empty}>Nenhum pedido encontrado.</p>
      ) : (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th className={styles.thRight}>Total</th>
                  <th className={styles.thCenter}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((p) => (
                  <tr key={p.id}>
                    <td className={styles.orderId}>#{p.id}</td>
                    <td>{formatDate(p.date)}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${STATUS_VARIANT[p.status] ?? ''}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className={styles.tdRight}>
                      {formatPrice(p.total)}{' '}
                      <span className={styles.itemCount}>de {p.items} itens</span>
                    </td>
                    <td className={styles.tdCenter}>
                      <Link
                        to={`/minha-conta/pedidos/${p.id}`}
                        className={styles.viewBtn}
                        aria-label={`Visualizar pedido #${p.id}`}
                      >
                        <Eye size={14} aria-hidden="true" />
                        Visualizar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {hasNext && (
            <button
              className={styles.nextBtn}
              onClick={() => setPage((p) => p + 1)}
            >
              Próximo →
            </button>
          )}
        </>
      )}
    </div>
  )
}

export default Pedidos
