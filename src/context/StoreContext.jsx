// src/context/StoreContext.jsx
// Estado global em memória (carrinho, favoritos, usuário, busca) + navegação.
// Espelha exatamente o modelo do protótipo TADS Store (offline): sem API/Supabase.
import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRODUCTS } from '@/data/products';
import { finalPrice } from '@/lib/format';

const StoreContext = createContext(null);

// Mapeia os nomes de rota do protótipo para os caminhos do react-router.
const ROUTE_PATH = {
  home: '/',
  catalog: '/produtos',
  detail: '/produto',
  cart: '/carrinho',
  checkout: '/checkout',
  login: '/login',
  wishlist: '/lista-de-desejos',
  account: '/minha-conta',
};

export function StoreProvider({ children }) {
  const navigate = useNavigate();
  const products = PRODUCTS;

  const [user, setUser] = useState(null);
  const [cart, setCart] = useState({});
  const [wish, setWish] = useState({});
  const [search, setSearch] = useState('');

  // nav('catalog', 'Eletrônicos') / nav('detail', 3) / nav('home')
  const nav = useCallback((name, id = null) => {
    const base = ROUTE_PATH[name] || '/';
    if (name === 'detail' && id != null) {
      navigate(`${base}/${id}`);
    } else if (name === 'catalog' && id != null) {
      navigate(base, { state: { cat: id } });
    } else {
      navigate(base);
    }
    window.scrollTo(0, 0);
  }, [navigate]);

  const addToCart = useCallback((p, qty = 1) => {
    setCart((c) => ({ ...c, [p.id]: { product: p, qty: (c[p.id]?.qty || 0) + qty } }));
  }, []);

  const setQty = useCallback((id, qty) => {
    setCart((c) => {
      if (qty <= 0) { const n = { ...c }; delete n[id]; return n; }
      return { ...c, [id]: { ...c[id], qty } };
    });
  }, []);

  const removeItem = useCallback((id) => {
    setCart((c) => { const n = { ...c }; delete n[id]; return n; });
  }, []);

  const toggleWish = useCallback((id) => {
    setWish((w) => ({ ...w, [id]: !w[id] }));
  }, []);

  const clearCart = useCallback(() => setCart({}), []);
  const login = useCallback((name) => { setUser({ name }); nav('home'); }, [nav]);
  const logout = useCallback(() => { setUser(null); nav('home'); }, [nav]);

  const cartCount = Object.values(cart).reduce((s, it) => s + it.qty, 0);
  const cartTotal = Object.values(cart).reduce((s, it) => s + finalPrice(it.product) * it.qty, 0);
  const wishCount = Object.values(wish).filter(Boolean).length;

  const value = useMemo(() => ({
    products, user, cart, wish, search, setSearch,
    nav, addToCart, setQty, removeItem, toggleWish, clearCart, login, logout,
    cartCount, cartTotal, wishCount,
  }), [products, user, cart, wish, search, nav, addToCart, setQty, removeItem, toggleWish, clearCart, login, logout, cartCount, cartTotal, wishCount]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore deve ser usado dentro de <StoreProvider>');
  return ctx;
}

export default StoreContext;
