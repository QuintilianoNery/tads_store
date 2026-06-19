// src/context/StoreContext.jsx
// Estado global em memória (carrinho, favoritos, usuário, busca) + navegação.
// Espelha exatamente o modelo do protótipo TADS Store (offline): sem API/Supabase.
import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts, getCategories } from '@/services/productService';
import { signIn, signUp, signOut, onAuthStateChange } from '@/services/authService';
import { getFavorites, addFavorite, removeFavorite } from '@/services/favoritesService';
import { getCart, setCartItem, removeCartItem, clearCart as clearCartRemote } from '@/services/cartService';
import { finalPrice } from '@/lib/format';

const StoreContext = createContext(null);

// Tempo de inatividade antes do logout automático (30 minutos).
const IDLE_LIMIT_MS = 30 * 60 * 1000;
const ACTIVITY_EVENTS = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

// Normaliza o usuário do Supabase para o formato usado nas telas ({ name, ... }).
function mapUser(supaUser) {
  if (!supaUser) return null;
  const meta = supaUser.user_metadata ?? {};
  return {
    id: supaUser.id,
    email: supaUser.email,
    name: meta.display_name || meta.full_name || supaUser.email?.split('@')[0] || 'Cliente',
  };
}

// Traduz mensagens de erro do Supabase para português.
function parseAuthError(message) {
  const map = {
    'Invalid login credentials': 'E-mail ou senha incorretos.',
    'Email not confirmed': 'Confirme seu e-mail antes de fazer login.',
    'User already registered': 'Este e-mail já está cadastrado.',
    'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres.',
    'Unable to validate email address: invalid format': 'Formato de e-mail inválido.',
  };
  return map[message] ?? 'Ocorreu um erro. Tente novamente.';
}

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

  // Autenticação via Supabase. `user` é restaurado da sessão (JWT) no load.
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  // Verdadeiro até a 1ª resposta do Supabase sobre a sessão (restauração
  // assíncrona no reload). Evita redirecionar de uma rota protegida antes
  // de saber se existe sessão.
  const [authInitializing, setAuthInitializing] = useState(true);
  const [cart, setCart] = useState({});
  const [wish, setWish] = useState({});
  const [search, setSearch] = useState('');

  // Restaura a sessão do Supabase e mantém o usuário sincronizado.
  // O Supabase persiste o JWT no localStorage e dispara INITIAL_SESSION no load,
  // então o usuário permanece logado após reload até o logout/expiração.
  useEffect(() => {
    const unsubscribe = onAuthStateChange((session) => {
      setUser(mapUser(session?.user));
      setAuthInitializing(false);
    });
    return unsubscribe;
  }, []);

  const userId = user?.id ?? null;

  // Favoritos e carrinho vinculados ao usuário: ao logar, descarta o estado
  // anônimo e carrega a lista real do Supabase; ao deslogar, limpa ambos.
  useEffect(() => {
    let active = true;
    if (!userId) { setWish({}); setCart({}); return undefined; }
    (async () => {
      try {
        const [ids, cartRows] = await Promise.all([getFavorites(userId), getCart(userId)]);
        if (!active) return;
        setWish(Object.fromEntries(ids.map((id) => [id, true])));
        setCart(Object.fromEntries(cartRows.map((row) => [row.product.id, { product: row.product, qty: row.qty }])));
      } catch (err) {
        console.error('Falha ao carregar favoritos/carrinho do usuário:', err);
      }
    })();
    return () => { active = false; };
  }, [userId]);

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

  // Adiciona ao carrinho (bloqueia sem estoque e limita à quantidade em estoque)
  // e sincroniza se logado.
  const addToCart = useCallback((product, qty = 1) => {
    if (product?.stock != null && product.stock <= 0) return;
    const existing = cart[product.id]?.qty || 0;
    let newQty = existing + qty;
    if (product?.stock != null) newQty = Math.min(newQty, product.stock); // nunca passa do estoque
    if (newQty === existing) return; // já está no máximo disponível
    setCart((prevCart) => ({ ...prevCart, [product.id]: { product, qty: newQty } }));
    if (userId) setCartItem(userId, product, newQty).catch((err) => console.error('Falha ao sincronizar carrinho:', err));
  }, [cart, userId]);

  const setQty = useCallback((id, qty) => {
    setCart((prevCart) => {
      if (qty <= 0) {
        const nextCart = { ...prevCart };
        delete nextCart[id];
        return nextCart;
      }
      return { ...prevCart, [id]: { ...prevCart[id], qty } };
    });
    if (userId) {
      if (qty <= 0) {
        removeCartItem(userId, id).catch((err) => console.error('Falha ao sincronizar carrinho:', err));
      } else {
        const product = cart[id]?.product;
        if (product) setCartItem(userId, product, qty).catch((err) => console.error('Falha ao sincronizar carrinho:', err));
      }
    }
  }, [cart, userId]);

  const removeItem = useCallback((id) => {
    setCart((prevCart) => {
      const nextCart = { ...prevCart };
      delete nextCart[id];
      return nextCart;
    });
    if (userId) removeCartItem(userId, id).catch((err) => console.error('Falha ao sincronizar carrinho:', err));
  }, [userId]);

  // Alterna o favorito localmente e, se logado, sincroniza com o Supabase.
  const toggleWish = useCallback((id) => {
    const willBeFavorited = !wish[id];
    setWish((prevWish) => ({ ...prevWish, [id]: willBeFavorited }));
    if (userId) {
      const op = willBeFavorited ? addFavorite(userId, id) : removeFavorite(userId, id);
      op.catch((err) => console.error('Falha ao sincronizar favorito:', err));
    }
  }, [wish, userId]);

  const clearCart = useCallback(() => {
    setCart({});
    if (userId) clearCartRemote(userId).catch((err) => console.error('Falha ao sincronizar carrinho:', err));
  }, [userId]);

  // ─── Autenticação (Supabase) ────────────────────────────────
  const clearAuthError = useCallback(() => setAuthError(null), []);

  // Login com e-mail + senha. Retorna { success, error }.
  // A navegação fica a cargo de quem chama (ex.: retornar à rota pretendida).
  const login = useCallback(async (email, password) => {
    setAuthLoading(true); setAuthError(null);
    try {
      const { user: supaUser } = await signIn({ email, password });
      setUser(mapUser(supaUser));
      return { success: true };
    } catch (err) {
      const message = parseAuthError(err.message);
      setAuthError(message);
      return { success: false, error: message };
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // Cadastro com nome + e-mail + senha. Se o projeto exigir confirmação de
  // e-mail, o Supabase não devolve sessão; caso contrário, já loga na hora.
  // `loggedIn` indica que já há sessão (a navegação fica a cargo de quem chama).
  const register = useCallback(async (fullName, email, password) => {
    setAuthLoading(true); setAuthError(null);
    try {
      const data = await signUp({ fullName, email, password });
      if (data?.session) {
        setUser(mapUser(data.user));
        return { success: true, needsConfirmation: false, loggedIn: true };
      }
      return { success: true, needsConfirmation: true, loggedIn: false };
    } catch (err) {
      const message = parseAuthError(err.message);
      setAuthError(message);
      return { success: false, error: message };
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut();
    } finally {
      setUser(null);
      nav('home');
    }
  }, [nav]);

  // Logout automático após inatividade — qualquer interação reinicia o contador.
  const idleTimerRef = useRef(null);
  useEffect(() => {
    if (!user) return undefined;
    function resetTimer() {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => { logout(); }, IDLE_LIMIT_MS);
    }
    ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, resetTimer, { passive: true }));
    resetTimer();
    return () => {
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, resetTimer));
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [user, logout]);

  const cartCount = Object.values(cart).reduce((total, item) => total + item.qty, 0);
  const cartTotal = Object.values(cart).reduce((total, item) => total + finalPrice(item.product) * item.qty, 0);
  const wishCount = Object.values(wish).filter(Boolean).length;

  const value = useMemo(() => ({
    products, categories, loadingCatalog, user, cart, wish, search, setSearch,
    nav, addToCart, setQty, removeItem, toggleWish, clearCart,
    login, register, logout, authLoading, authError, authInitializing, clearAuthError,
    cartCount, cartTotal, wishCount,
  }), [products, categories, loadingCatalog, user, cart, wish, search, nav, addToCart, setQty, removeItem, toggleWish, clearCart, login, register, logout, authLoading, authError, authInitializing, clearAuthError, cartCount, cartTotal, wishCount]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore deve ser usado dentro de <StoreProvider>');
  return store;
}

export default StoreContext;
