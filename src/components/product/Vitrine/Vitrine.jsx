// src/components/product/Vitrine/Vitrine.jsx
import ProdutoCard from '@/components/product/ProdutoCard/ProdutoCard'
import Spinner from '@/components/ui/Spinner/Spinner'
import styles from './Vitrine.module.css'
import { PackageSearch } from 'lucide-react'

/**
 * Grid de cards de produto com estados: carregando, erro e vazio.
 *
 * @param {Product[]} produtos    - Lista de produtos a exibir
 * @param {boolean}   isLoading   - Estado de carregamento
 * @param {string}    error       - Mensagem de erro (se houver)
 * @param {number}    columns     - Número de colunas (padrão: 4)
 */
function Vitrine({ produtos = [], isLoading = false, error = null, columns = 4 }) {
  if (isLoading) {
    return <Spinner message="Carregando produtos..." />
  }

  if (error) {
    return (
      <div className={styles.feedback} role="alert">
        <PackageSearch size={48} className={styles.feedbackIcon} aria-hidden="true" />
        <h3 className={styles.feedbackTitle}>Ops! Algo deu errado</h3>
        <p className={styles.feedbackMsg}>{error}</p>
      </div>
    )
  }

  if (produtos.length === 0) {
    return (
      <div className={styles.feedback}>
        <PackageSearch size={48} className={styles.feedbackIcon} aria-hidden="true" />
        <h3 className={styles.feedbackTitle}>Nenhum produto encontrado</h3>
        <p className={styles.feedbackMsg}>Tente uma busca diferente ou limpe os filtros.</p>
      </div>
    )
  }

  return (
    <section
      className={styles.grid}
      style={{ '--columns': columns }}
      aria-label={`${produtos.length} produtos encontrados`}
    >
      {produtos.map((produto) => (
        <ProdutoCard key={produto.id} produto={produto} />
      ))}
    </section>
  )
}

export default Vitrine
