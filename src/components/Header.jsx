// src/components/Header.jsx — topbar + barra principal (logo, busca, ações) + nav
// No desktop: barra de navegação com menus de categoria (hover).
// No celular: ícone hambúrguer abre uma gaveta lateral com as mesmas opções.
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Icon } from './Icon.jsx';
import { useStore } from '@/context/StoreContext';
import { fmtBRL } from '@/lib/format';
import { categoryLabel } from '@/utils/formatters';
import { useIsMobile } from '@/hooks/useMediaQuery';

const LOGO = '/images/tads_store_logo_cropped.png';

function ActionBtn({ children, onClick, count, label }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      aria-label={label}
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
// Exportado para ser reutilizado em outras telas (ex.: a página 404).
export const CATEGORY_GROUPS = [
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

// Grupo de categorias dentro da gaveta mobile: acordeão simples (toque).
function MobileCategoryGroup({ nav, label, slugs, onNavigate }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid var(--color-primary-700)' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '14px 4px', background: 'none', border: 'none', cursor: 'pointer', color: '#fff', fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)' }}
      >
        {label}
        <Icon.ChevronDown size={18} style={{ color: 'var(--color-primary-200)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--transition-fast)' }} />
      </button>
      {open && (
        <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 8 }}>
          {slugs.map((slug) => (
            <button
              key={slug}
              onClick={() => { nav('catalog', slug); onNavigate(); }}
              style={{ textAlign: 'left', padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary-200)', fontSize: 'var(--text-sm)' }}
            >{categoryLabel(slug)}</button>
          ))}
        </div>
      )}
    </div>
  );
}

// Gaveta lateral de navegação no celular.
function MobileDrawer({ open, onClose, nav, user, logout }) {
  // Trava o scroll do body enquanto a gaveta está aberta e fecha no Esc.
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [open, onClose]);

  if (!open) return null;
  const go = (name) => { nav(name); onClose(); };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300 }}>
      {/* Overlay */}
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.5)', animation: 'fadeIn 0.2s ease' }} />
      {/* Painel */}
      <nav
        aria-label="Menu principal"
        style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '82%', maxWidth: 320, background: 'var(--color-primary-900)', boxShadow: 'var(--shadow-xl)', display: 'flex', flexDirection: 'column', animation: 'slideInRight 0.25s ease', overflowY: 'auto' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid var(--color-primary-700)' }}>
          <span style={{ color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 'var(--font-bold)' }}>Menu</span>
          <button onClick={onClose} aria-label="Fechar menu" style={{ display: 'flex', padding: 4, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary-200)' }}>
            <Icon.X size={24} />
          </button>
        </div>

        <div style={{ padding: '8px 16px 16px' }}>
          <button onClick={() => go('home')} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', padding: '14px 4px', borderBottom: '1px solid var(--color-primary-700)', background: 'none', border: 'none', cursor: 'pointer', color: '#fff', fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)' }}>
            <Icon.Home size={18} /> Início
          </button>
          {CATEGORY_GROUPS.map((group) => (
            <MobileCategoryGroup key={group.label} nav={nav} label={group.label} slugs={group.slugs} onNavigate={onClose} />
          ))}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 12 }}>
            <button onClick={() => go('wishlist')} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 4px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary-100)', fontSize: 'var(--text-sm)' }}><Icon.Heart size={18} /> Lista de desejos</button>
            <button onClick={() => go('cart')} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 4px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary-100)', fontSize: 'var(--text-sm)' }}><Icon.Cart size={18} /> Carrinho</button>
            <button onClick={() => go(user ? 'account' : 'login')} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 4px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary-100)', fontSize: 'var(--text-sm)' }}><Icon.User size={18} /> {user ? 'Minha conta' : 'Entrar / Cadastrar'}</button>
            <button onClick={() => go('help')} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 4px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary-100)', fontSize: 'var(--text-sm)' }}><Icon.HelpCircle size={18} /> Central de ajuda</button>
            {user && (
              <button onClick={() => { logout(); onClose(); }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 4px', marginTop: 8, borderTop: '1px solid var(--color-primary-700)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary-200)', fontSize: 'var(--text-sm)' }}>Sair</button>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

function SearchForm({ query, setQuery, onSubmit, style }) {
  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', ...style }}>
      <input
        type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar produtos..."
        aria-label="Buscar produtos"
        style={{ flex: 1, minWidth: 0, padding: '12px 16px', border: '1.5px solid var(--color-gray-300)', borderRight: 'none', borderRadius: 'var(--radius-md) 0 0 var(--radius-md)', fontSize: 'var(--text-sm)', color: 'var(--color-gray-800)', outline: 'none' }}
      />
      <button type="submit" aria-label="Buscar" style={{ padding: '12px 16px', background: 'var(--color-primary-800)', color: '#fff', border: 'none', borderRadius: '0 var(--radius-md) var(--radius-md) 0', display: 'flex', alignItems: 'center', cursor: 'pointer', flexShrink: 0 }}>
        <Icon.Search size={18} />
      </button>
    </form>
  );
}

export default function Header() {
  const { nav, user, cartCount, cartTotal, wishCount, logout, setSearch } = useStore();
  const { pathname } = useLocation();
  const active = pathname === '/' ? 'home' : '';
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  // Texto local do campo de busca. Ao pesquisar, aplica o filtro global e
  // limpa o campo — assim o termo não fica "preso" ao navegar para categorias.
  const [query, setQuery] = useState('');

  const submitSearch = (e) => { e.preventDefault(); setSearch(query.trim()); nav('catalog'); setQuery(''); };

  // ── Layout mobile ──────────────────────────────────────────
  if (isMobile) {
    return (
      <header style={{ position: 'sticky', top: 0, zIndex: 200, background: '#fff', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ padding: '10px 0' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => setMenuOpen(true)} aria-label="Abrir menu" aria-expanded={menuOpen} style={{ display: 'flex', padding: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gray-700)' }}>
              <Icon.Menu size={24} />
            </button>
            <button onClick={() => nav('home')} aria-label="Página inicial" style={{ background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, display: 'flex', marginRight: 'auto' }}>
              <img src={LOGO} alt="TADS Store" style={{ height: 40, width: 'auto', objectFit: 'contain', display: 'block' }} />
            </button>
            <ActionBtn onClick={() => nav('wishlist')} count={user ? wishCount : 0} label="Lista de desejos"><Icon.Heart size={22} /></ActionBtn>
            <ActionBtn onClick={() => nav('cart')} count={cartCount} label="Carrinho"><Icon.Cart size={22} /></ActionBtn>
          </div>
          <div className="container" style={{ marginTop: 10 }}>
            <SearchForm query={query} setQuery={setQuery} onSubmit={submitSearch} style={{ width: '100%' }} />
          </div>
        </div>
        <MobileDrawer open={menuOpen} onClose={() => setMenuOpen(false)} nav={nav} user={user} logout={logout} />
      </header>
    );
  }

  // ── Layout desktop ─────────────────────────────────────────
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

          <SearchForm query={query} setQuery={setQuery} onSubmit={submitSearch} style={{ flex: 1 }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <ActionBtn onClick={() => nav('wishlist')} count={user ? wishCount : 0} label="Lista de desejos"><Icon.Heart size={22} /></ActionBtn>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ActionBtn onClick={() => nav('cart')} count={cartCount} label="Carrinho"><Icon.Cart size={22} /></ActionBtn>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-primary-800)', whiteSpace: 'nowrap' }}>{fmtBRL(cartTotal)}</span>
            </div>
            <ActionBtn onClick={() => nav(user ? 'account' : 'login')} label={user ? 'Minha conta' : 'Entrar'}><Icon.User size={22} /></ActionBtn>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ background: 'var(--color-primary-900)', borderTop: '1px solid var(--color-primary-700)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button
            onClick={() => nav('home')}
            style={{
              display: 'block', padding: '12px 16px', fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', letterSpacing: '0.025em',
              color: active === 'home' ? '#fff' : 'var(--color-primary-200)', background: 'none', border: 'none',
              borderBottom: '2px solid ' + (active === 'home' ? 'var(--color-accent)' : 'transparent'),
              cursor: 'pointer', transition: 'all var(--transition-fast)',
            }}
          >Home</button>
          {CATEGORY_GROUPS.map((group) => (
            <CategoryGroupNav key={group.label} nav={nav} label={group.label} slugs={group.slugs} />
          ))}
        </div>
      </nav>
    </header>
  );
}
