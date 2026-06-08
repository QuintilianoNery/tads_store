// src/pages/Home.jsx
import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Shield, Truck } from 'lucide-react'
import Vitrine from '@/components/product/Vitrine/Vitrine'
import Button from '@/components/ui/Button/Button'
import useFetch from '@/hooks/useFetch'
import { getFeaturedProducts } from '@/services/productService'
import styles from './Home.module.css'

function Home() {
  const fetchFn = useCallback(() => getFeaturedProducts(), [])
  const { data, isLoading, error } = useFetch(fetchFn)

  const produtos = data?.products ?? []

  return (
    <div className={styles.home}>
      {/* ── Hero ── */}
      <section className={styles.hero} aria-label="Banner principal">
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <span className={styles.heroTag}>Novo · 2026</span>
            <h1 className={styles.heroTitle}>
              O marketplace que
              <span className={styles.heroAccent}> você merecia.</span>
            </h1>
            <p className={styles.heroDesc}>
              Os melhores produtos, com entrega rápida e qualidade garantida.
              Explore o catálogo e encontre o que procura.
            </p>
            <div className={styles.heroCta}>
              <Link to="/produtos">
                <Button variant="accent" size="lg">
                  Ver produtos <ArrowRight size={18} aria-hidden="true" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="lg">
                  Criar conta
                </Button>
              </Link>
            </div>
          </div>

          <div className={styles.heroVisual} aria-hidden="true">
            <div className={styles.heroCard}>
              <img src="/images/tads_store_logo.png" alt="" className={styles.heroLogo} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Diferenciais ── */}
      <section className={styles.features} aria-label="Diferenciais">
        <div className="container">
          <ul className={styles.featuresList}>
            <li className={styles.feature}>
              <Truck size={28} className={styles.featureIcon} aria-hidden="true" />
              <div>
                <h3>Entrega rápida</h3>
                <p>Receba em até 3 dias úteis</p>
              </div>
            </li>
            <li className={styles.feature}>
              <Shield size={28} className={styles.featureIcon} aria-hidden="true" />
              <div>
                <h3>Compra segura</h3>
                <p>Seus dados sempre protegidos</p>
              </div>
            </li>
            <li className={styles.feature}>
              <Zap size={28} className={styles.featureIcon} aria-hidden="true" />
              <div>
                <h3>Melhores preços</h3>
                <p>Ofertas todos os dias</p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* ── Produtos em destaque ── */}
      <section className={styles.featured}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Produtos em Destaque</h2>
            <Link to="/produtos" className={styles.viewAll}>
              Ver todos <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <Vitrine produtos={produtos} isLoading={isLoading} error={error} columns={4} />
        </div>
      </section>
    </div>
  )
}

export default Home
