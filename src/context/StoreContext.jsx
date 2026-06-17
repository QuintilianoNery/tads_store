// src/context/StoreContext.jsx
// Estado global em memória (carrinho, favoritos, usuário, busca) + navegação.
// Espelha exatamente o modelo do protótipo TADS Store (offline): sem API/Supabase.
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts, getCategories } from '@/services/productService';
import { finalPrice } from '@/lib/format';

const StoreContext = createContext(null);

// Únicas categorias exibidas na loja (slugs do DummyJSON). Produtos e categorias
// fora desta lista são descartados ao carregar o catálogo.
const ALLOWED_CATEGORIES = new Set([
  'laptops',
  'mobile-accessories',
  'smartphones',
  'tablets',
  'sports-accessories',
  'sunglasses',
  'mens-watches',
  'womens-watches',
  'motorcycle',
  'vehicle',
]);

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

  // Catálogo (produtos + categorias) vindo do DummyJSON, carregado uma vez no mount.
  // Filtragem, busca e detalhe continuam acontecendo localmente sobre essa lista.
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['Todos']);
  const [loadingCatalog, setLoadingCatalog] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([getAllProducts(), getCategories()]);
        if (!active) return;
        // Mantém apenas os produtos das categorias permitidas.
        const allowedProducts = (productsResponse.products ?? []).filter((product) =>
          ALLOWED_CATEGORIES.has(product.category)
        );
        setProducts(allowedProducts);
        // /products/categories pode devolver strings ou objetos { slug, name, url }.
        const allowedSlugs = (categoriesResponse ?? [])
          .map((category) => (typeof category === 'string' ? category : category.slug))
          .filter((slug) => ALLOWED_CATEGORIES.has(slug));
        setCategories(['Todos', ...allowedSlugs]);
      } catch (err) {
        console.error('Falha ao carregar catálogo do DummyJSON:', err);
      } finally {
        if (active) setLoadingCatalog(false);
      }
    })();
    return () => { active = false; };
  }, []);

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

  const addToCart = useCallback((product, qty = 1) => {
    setCart((prevCart) => ({
      ...prevCart,
      [product.id]: { product, qty: (prevCart[product.id]?.qty || 0) + qty },
    }));
  }, []);

  const setQty = useCallback((id, qty) => {
    setCart((prevCart) => {
      if (qty <= 0) {
        const nextCart = { ...prevCart };
        delete nextCart[id];
        return nextCart;
      }
      return { ...prevCart, [id]: { ...prevCart[id], qty } };
    });
  }, []);

  const removeItem = useCallback((id) => {
    setCart((prevCart) => {
      const nextCart = { ...prevCart };
      delete nextCart[id];
      return nextCart;
    });
  }, []);

  const toggleWish = useCallback((id) => {
    setWish((prevWish) => ({ ...prevWish, [id]: !prevWish[id] }));
  }, []);

  const clearCart = useCallback(() => setCart({}), []);
  const login = useCallback((name) => { setUser({ name }); nav('home'); }, [nav]);
  const logout = useCallback(() => { setUser(null); nav('home'); }, [nav]);

  const cartCount = Object.values(cart).reduce((total, item) => total + item.qty, 0);
  const cartTotal = Object.values(cart).reduce((total, item) => total + finalPrice(item.product) * item.qty, 0);
  const wishCount = Object.values(wish).filter(Boolean).length;

  const value = useMemo(() => ({
    products, categories, loadingCatalog, user, cart, wish, search, setSearch,
    nav, addToCart, setQty, removeItem, toggleWish, clearCart, login, logout,
    cartCount, cartTotal, wishCount,
  }), [products, categories, loadingCatalog, user, cart, wish, search, nav, addToCart, setQty, removeItem, toggleWish, clearCart, login, logout, cartCount, cartTotal, wishCount]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore deve ser usado dentro de <StoreProvider>');
  return store;
}

export default StoreContext;
