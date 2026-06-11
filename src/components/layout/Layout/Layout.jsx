// src/components/layout/Layout/Layout.jsx
// Usado como wrapper de rotas no React Router v6 via <Outlet />
import { Outlet } from 'react-router-dom'
import Header from '@/components/layout/Header/Header'
import Footer from '@/components/layout/Footer/Footer'
import styles from './Layout.module.css'

/**
 * Layout raiz — embrulha todas as páginas via React Router Outlet.
 * O React Router injeta o componente filho através do <Outlet />.
 * Para uso fora de rotas, também aceita children como fallback.
 */
function Layout({ children }) {
  return (
    <div className={styles.appWrapper}>
      <Header />
      <main className={styles.main} id="main-content">
        {/* Outlet é usado quando o Layout é uma rota pai no React Router */}
        <Outlet />
        {/* children é fallback para uso direto */}
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
