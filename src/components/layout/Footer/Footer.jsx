// src/components/layout/Footer/Footer.jsx
import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <Link to="/" aria-label="TADS Store — Página inicial">
            <img src="/images/tads_store_logo.png" alt="TADS Store" className={styles.logo} />
          </Link>
        </div>

        <nav className={styles.links} aria-label="Links do rodapé">
          <Link to="/produtos">Produtos</Link>
          <Link to="/lista-de-desejos">Lista de Desejos</Link>
          <Link to="/minha-conta">Minha Conta</Link>
        </nav>

        <p className={styles.copy}>
          © {year} TADS Store. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}

export default Footer
