// src/components/Header.jsx — topbar + barra principal (logo, busca, ações) + nav
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Icon } from './Icon.jsx';
import { useStore } from '@/context/StoreContext';
import { fmtBRL } from '@/lib/format';
import { categoryLabel } from '@/utils/formatters';

const LOGO = '/images/tads_store_logo_cropped.png';

function ActionBtn({ children, onClick, count }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8, color: isHovered ? 'var(--color-primary-800)' : 'var(--color-gray-700)', background: isHovered ? 'var(--color-primary-50)' : 'none', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all var(--transition-fast)' }}
    >
      {children}
      {count > 0 && (
        <span style={{ position: 'absolute', top: 0, right: 0, minWidth: '1.1rem', height: '1.1rem', padding: '0 3px', background: 'var(--color-accent)', color: '#fff', borderRadius: 'var(--radius-full)', fontSize: '0.625rem', fontWeight: 'var(--font-bold)', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>{count}</span>
      )}
    </button>
  );
}

// Grupos de categorias exibidos no menu superior. Cada grupo é um item pai
// não-clicável cujo submenu lista os slugs (DummyJSON) relacionados.
const CATEGORY_GROUPS = [
  { label: 'Eletrônicos', slugs: ['laptops', 'mobile-accessories', 'smartphones', 'tablets'] },
  { label: 'Acessórios', slugs: ['sports-accessories', 'sunglasses', 'mens-watches', 'womens-watches'] },
  { label: 'Velocidade', slugs: ['motorcycle', 'vehicle'] },
];

// Item de grupo: pai não-clicável; submenu aparece ao passar o mouse.
function CategoryGroupNav({ nav, label, slugs }) {
  const [open, setOpen] = useState(false);
  const [hoveredSlug, setHoveredSlug] = useState(null);
  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => { setOpen(false); setHoveredSlug(null); }}
    >
      <span
        style={{
          display: 'flex', alignItems: 'center', gap: 4, padding: '12px 16px',
          fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)',
          letterSpacing: '0.025em', color: open ? '#fff' : 'var(--color-primary-200)',
          borderBottom: '2px solid ' + (open ? 'var(--color-accent)' : 'transparent'),
          cursor: 'default', transition: 'all var(--transition-fast)',
        }}
      >
        {label}
        <Icon.ChevronDown size={14} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--transition-fast)' }} />
      </span>
      {open && (
        <div
          role="menu"
          style={{
            position: 'absolute', top: '100%', left: 0, minWidth: '12rem',
            background: 'var(--color-primary-900)', borderTop: '2px solid var(--color-accent)',
            boxShadow: 'var(--shadow-md)', padding: '4px 0', zIndex: 210,
          }}
        >
          {slugs.map((slug) => (
            <button
              key={slug}
              role="menuitem"
              onClick={() => { nav('catalog', slug); setOpen(false); }}
              onMouseEnter={() => setHoveredSlug(slug)}
              onMouseLeave={() => setHoveredSlug(null)}
              style={{
                display: 'block', width: '100%', textAlign: 'left', padding: '8px 16px',
                fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)',
                color: hoveredSlug === slug ? '#fff' : 'var(--color-primary-200)',
                background: hoveredSlug === slug ? 'var(--color-primary-800)' : 'none',
                border: 'none', cursor: 'pointer', transition: 'all var(--transition-fast)',
              }}
            >{categoryLabel(slug)}</button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const { nav, user, cartCount, cartTotal, wishCount, logout, search, setSearch } = useStore();
  const { pathname } = useLocation();
  const active = pathname === '/' ? 'home' : '';

  const navItem = (label, to, key = to) => (
    <button
      onClick={() => nav(to)}
      style={{
        display: 'block', padding: '12px 16px', fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', letterSpacing: '0.025em',
        color: active === key ? '#fff' : 'var(--color-primary-200)', background: 'none', border: 'none',
        borderBottom: '2px solid ' + (active === key ? 'var(--color-accent)' : 'transparent'),
        cursor: 'pointer', transition: 'all var(--transition-fast)',
      }}
    >{label}</button>
  );

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 200, background: '#fff', boxShadow: 'var(--shadow-sm)' }}>
      {/* Topbar */}
      <div style={{ background: 'var(--color-primary-800)', color: '#fff', fontSize: 'var(--text-xs)', padding: '8px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {user ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-primary-100)' }}>
              <Icon.User size={14} /> Olá, <strong style={{ color: '#fff' }}>{user.name}</strong>!
            </span>
          ) : (
            <button onClick={() => nav('login')} style={{ color: 'var(--color-primary-100)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--text-xs)' }}>Sign up / Login</button>
          )}
          {user && (
            <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-primary-200)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--text-xs)' }}>Logout</button>
          )}
        </div>
      </div>

      {/* Barra principal */}
      <div style={{ padding: '16px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <button onClick={() => nav('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, display: 'flex' }}>
            <img src={LOGO} alt="TADS Store" style={{ height: 52, width: 'auto', objectFit: 'contain', display: 'block' }} />
          </button>

          <form onSubmit={(e) => { e.preventDefault(); nav('catalog'); }} style={{ flex: 1, display: 'flex' }}>
            <input
              type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar produtos..."
              style={{ flex: 1, padding: '12px 16px', border: '1.5px solid var(--color-gray-300)', borderRight: 'none', borderRadius: 'var(--radius-md) 0 0 var(--radius-md)', fontSize: 'var(--text-sm)', color: 'var(--color-gray-800)', outline: 'none' }}
            />
            <button type="submit" style={{ padding: '12px 16px', background: 'var(--color-primary-800)', color: '#fff', border: 'none', borderRadius: '0 var(--radius-md) var(--radius-md) 0', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <Icon.Search size={18} />
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <ActionBtn onClick={() => nav('wishlist')} count={user ? wishCount : 0}><Icon.Heart size={22} /></ActionBtn>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ActionBtn onClick={() => nav('cart')} count={cartCount}><Icon.Cart size={22} /></ActionBtn>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-primary-800)', whiteSpace: 'nowrap' }}>{fmtBRL(cartTotal)}</span>
            </div>
            <ActionBtn onClick={() => nav(user ? 'account' : 'login')}><Icon.User size={22} /></ActionBtn>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ background: 'var(--color-primary-900)', borderTop: '1px solid var(--color-primary-700)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {navItem('Home', 'home')}
          {CATEGORY_GROUPS.map((group) => (
            <CategoryGroupNav key={group.label} nav={nav} label={group.label} slugs={group.slugs} />
          ))}
        </div>
      </nav>
    </header>
  );
}
