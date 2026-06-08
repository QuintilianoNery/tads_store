// src/components/layout/Header/Header.jsx
import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingCart, Heart, User, LogOut, Menu, X, ChevronDown } from 'lucide-react'
import useAuthStore from '@/store/authStore'
import useCartStore from '@/store/cartStore'
import useWishlistStore from '@/store/wishlistStore'
import { formatPrice } from '@/utils/formatters'
import MiniCart from '@/components/cart/MiniCart/MiniCart'
import styles from './Header.module.css'

function Header() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const miniCartRef = useRef(null)

  const { user, logout, isAuthenticated } = useAuthStore()
  const cartItems = useCartStore((s) => s.items)
  const totalItems = useCartStore((s) => s.totalItems)
  const totalPrice = useCartStore((s) => s.totalPrice)
  const wishlistTotal = useWishlistStore((s) => s.totalItems)

  // Fecha mini-cart ao clicar fora
  useEffect(() => {
    function handleClickOutside(e) {
      if (miniCartRef.current && !miniCartRef.current.contains(e.target)) {
        setIsMiniCartOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSearch(e) {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/produtos?busca=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <header className={styles.header}>
      {/* ── Topbar ── */}
      <div className={styles.topbar}>
        <div className={`container ${styles.topbarInner}`}>
          {isAuthenticated() ? (
            <span className={styles.welcomeMsg}>
              <User size={14} aria-hidden="true" />
              Olá, <strong>{user?.user_metadata?.display_name ?? user?.email}</strong>!
            </span>
          ) : (
            <div className={styles.authLinks}>
              <Link to="/login" className={styles.topbarLink}>Sign up / Login</Link>
            </div>
          )}

          {isAuthenticated() && (
            <button
              onClick={handleLogout}
              className={styles.logoutBtn}
              aria-label="Sair da conta"
            >
              <LogOut size={14} aria-hidden="true" />
              Logout
            </button>
          )}
        </div>
      </div>

      {/* ── Barra principal ── */}
      <div className={styles.mainBar}>
        <div className={`container ${styles.mainBarInner}`}>
          {/* Logo */}
          <Link to="/" className={styles.logo} aria-label="TADS Store — Página inicial">
            <img src="/images/tads_store_logo.png" alt="TADS Store" className={styles.logoImg} />
          </Link>

          {/* Busca */}
          <form onSubmit={handleSearch} className={styles.searchForm} role="search">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar produtos..."
              className={styles.searchInput}
              aria-label="Buscar produtos"
            />
            <button type="submit" className={styles.searchBtn} aria-label="Pesquisar">
              <Search size={18} aria-hidden="true" />
            </button>
          </form>

          {/* Ações */}
          <div className={styles.actions}>
            {/* Wishlist */}
            <Link to="/lista-de-desejos" className={styles.actionBtn} aria-label={`Lista de desejos — ${wishlistTotal()} itens`}>
              <Heart size={22} aria-hidden="true" />
              {wishlistTotal() > 0 && (
                <span className={styles.badge} aria-hidden="true">{wishlistTotal()}</span>
              )}
            </Link>

            {/* Carrinho */}
            <div className={styles.cartWrapper} ref={miniCartRef}>
              <button
                className={styles.actionBtn}
                onClick={() => setIsMiniCartOpen((v) => !v)}
                aria-label={`Carrinho — ${totalItems()} itens`}
                aria-expanded={isMiniCartOpen}
              >
                <ShoppingCart size={22} aria-hidden="true" />
                {totalItems() > 0 && (
                  <span className={styles.badge} aria-hidden="true">{totalItems()}</span>
                )}
              </button>
              <span className={styles.cartTotal}>{formatPrice(totalPrice())}</span>

              {isMiniCartOpen && (
                <MiniCart
                  items={cartItems}
                  onClose={() => setIsMiniCartOpen(false)}
                />
              )}
            </div>

            {/* Conta */}
            {isAuthenticated() ? (
              <Link to="/minha-conta" className={styles.actionBtn} aria-label="Minha conta">
                <User size={22} aria-hidden="true" />
              </Link>
            ) : (
              <Link to="/login" className={styles.actionBtn} aria-label="Entrar na conta">
                <User size={22} aria-hidden="true" />
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              className={styles.mobileMenuBtn}
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Navegação principal ── */}
      <nav
        className={`${styles.nav} ${isMobileMenuOpen ? styles.navOpen : ''}`}
        aria-label="Navegação principal"
      >
        <div className={`container ${styles.navInner}`}>
          <Link to="/" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>
            Home
          </Link>
          <Link to="/produtos" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>
            Comprar
          </Link>
          <Link to="/produtos" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>
            Categorias
          </Link>
        </div>
      </nav>
    </header>
  )
}

export default Header
