// src/pages/NaoEncontrado.jsx
import { Link } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import Button from '@/components/ui/Button/Button'
import styles from './NaoEncontrado.module.css'

function NaoEncontrado() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.iconWrapper} aria-hidden="true">
          <SearchX size={64} />
        </div>
        <span className={styles.code} aria-hidden="true">404</span>
        <h1 className={styles.title}>Página não encontrada</h1>
        <p className={styles.desc}>
          A página que você está procurando não existe ou foi removida.
          Verifique o endereço ou volte ao início.
        </p>
        <div className={styles.actions}>
          <Link to="/">
            <Button variant="primary" size="lg">Ir para o início</Button>
          </Link>
          <Link to="/produtos">
            <Button variant="secondary" size="lg">Ver produtos</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NaoEncontrado
