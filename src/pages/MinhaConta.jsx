// src/pages/MinhaConta.jsx
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ShoppingBag, MapPin, User, LogOut } from 'lucide-react'
import useAuthStore from '@/store/authStore'
import styles from './MinhaConta.module.css'

const NAV_ITEMS = [
  { to: '/minha-conta',           label: 'Painel',           icon: LayoutDashboard, end: true },
  { to: '/minha-conta/pedidos',   label: 'Pedidos',          icon: ShoppingBag },
  { to: '/minha-conta/enderecos', label: 'Endereços',        icon: MapPin },
  { to: '/minha-conta/detalhes',  label: 'Detalhes da conta',icon: User },
]

function MinhaConta() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  const displayName = user?.user_metadata?.display_name ?? user?.email ?? 'Usuário'

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.pageTitle}>Minha Conta</h1>

        <div className={styles.layout}>
          {/* ── Sidebar ── */}
          <aside className={styles.sidebar} aria-label="Menu da conta">
            <nav>
              <ul className={styles.navList}>
                {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      end={end}
                      className={({ isActive }) =>
                        `${styles.navLink} ${isActive ? styles.activeLink : ''}`
                      }
                    >
                      <Icon size={18} aria-hidden="true" />
                      {label}
                    </NavLink>
                  </li>
                ))}

                <li>
                  <button className={styles.logoutLink} onClick={handleLogout}>
                    <LogOut size={18} aria-hidden="true" />
                    Sair
                  </button>
                </li>
              </ul>
            </nav>
          </aside>

          {/* ── Conteúdo ── */}
          <main className={styles.content}>
            <Outlet context={{ user, displayName }} />
          </main>
        </div>
      </div>
    </div>
  )
}

// ── Sub-página: Painel ─────────────────────────────────────────
export function Painel() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const displayName = user?.user_metadata?.display_name ?? user?.email ?? 'Usuário'

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <div className={styles.panel}>
      <p className={styles.panelGreeting}>
        Olá, <strong>{displayName}</strong>!{' '}
        <span className={styles.notYou}>
          (Não é {displayName}?{' '}
          <button onClick={handleLogout} className={styles.inlineLink}>Sair</button>)
        </span>
      </p>
      <p className={styles.panelDesc}>
        A partir do painel de controle da sua conta, você pode ver suas{' '}
        <strong>compras recentes</strong>, gerenciar seus{' '}
        <strong>endereços de entrega e faturamento</strong>, e{' '}
        <strong>editar sua senha e detalhes da conta</strong>.
      </p>
    </div>
  )
}

export default MinhaConta
