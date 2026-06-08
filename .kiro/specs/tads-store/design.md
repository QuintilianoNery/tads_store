# TADS Store — Design

## Architecture Overview

```
tads_store/
├── src/
│   ├── assets/                    # Imagens, ícones, fontes estáticas
│   ├── components/                # Componentes reutilizáveis (sem conhecimento de rota)
│   │   ├── Layout/
│   │   │   ├── Layout.jsx
│   │   │   └── Layout.module.css
│   │   ├── Header/
│   │   │   ├── Header.jsx
│   │   │   └── Header.module.css
│   │   ├── Footer/
│   │   │   ├── Footer.jsx
│   │   │   └── Footer.module.css
│   │   ├── Breadcrumb/
│   │   │   ├── Breadcrumb.jsx
│   │   │   └── Breadcrumb.module.css
│   │   ├── ProductCard/
│   │   │   ├── ProductCard.jsx
│   │   │   └── ProductCard.module.css
│   │   ├── ProductGrid/
│   │   │   ├── ProductGrid.jsx
│   │   │   └── ProductGrid.module.css
│   │   ├── MiniCart/
│   │   │   ├── MiniCart.jsx
│   │   │   └── MiniCart.module.css
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   └── Button.module.css
│   │   ├── Badge/
│   │   │   ├── Badge.jsx
│   │   │   └── Badge.module.css
│   │   ├── StarRating/
│   │   │   ├── StarRating.jsx
│   │   │   └── StarRating.module.css
│   │   ├── FavoriteButton/
│   │   │   ├── FavoriteButton.jsx
│   │   │   └── FavoriteButton.module.css
│   │   ├── PrivateRoute/
│   │   │   └── PrivateRoute.jsx
│   │   ├── QuickView/
│   │   │   ├── QuickView.jsx
│   │   │   └── QuickView.module.css
│   │   ├── Pagination/
│   │   │   ├── Pagination.jsx
│   │   │   └── Pagination.module.css
│   │   └── CategoryPanel/
│   │       ├── CategoryPanel.jsx
│   │       └── CategoryPanel.module.css
│   │
│   ├── pages/
│   │   ├── Home/
│   │   │   ├── Home.jsx
│   │   │   └── Home.module.css
│   │   ├── Products/
│   │   │   ├── Products.jsx
│   │   │   └── Products.module.css
│   │   ├── ProductDetail/
│   │   │   ├── ProductDetail.jsx
│   │   │   └── ProductDetail.module.css
│   │   ├── Login/
│   │   │   ├── Login.jsx
│   │   │   └── Login.module.css
│   │   ├── MyAccount/
│   │   │   ├── MyAccount.jsx
│   │   │   └── MyAccount.module.css
│   │   ├── Orders/
│   │   │   ├── Orders.jsx
│   │   │   └── Orders.module.css
│   │   ├── OrderDetail/
│   │   │   ├── OrderDetail.jsx
│   │   │   └── OrderDetail.module.css
│   │   ├── Addresses/
│   │   │   ├── Addresses.jsx
│   │   │   └── Addresses.module.css
│   │   ├── AccountDetails/
│   │   │   ├── AccountDetails.jsx
│   │   │   └── AccountDetails.module.css
│   │   ├── Wishlist/
│   │   │   ├── Wishlist.jsx
│   │   │   └── Wishlist.module.css
│   │   ├── Cart/
│   │   │   ├── Cart.jsx
│   │   │   └── Cart.module.css
│   │   ├── Checkout/
│   │   │   ├── Checkout.jsx
│   │   │   └── Checkout.module.css
│   │   ├── OrderReceived/
│   │   │   ├── OrderReceived.jsx
│   │   │   └── OrderReceived.module.css
│   │   └── NotFound/
│   │       ├── NotFound.jsx
│   │       └── NotFound.module.css
│   │
│   ├── store/                     # Zustand stores
│   │   ├── useCartStore.js        # Estado do carrinho
│   │   ├── useWishlistStore.js    # Estado da wishlist
│   │   └── useAuthStore.js        # Estado de autenticação (sincronizado com Supabase)
│   │
│   ├── lib/                       # Integrações externas
│   │   ├── supabase.js            # Cliente Supabase
│   │   └── mercadopago.js         # Utilitário Mercado Pago (server-side via Edge Function)
│   │
│   ├── services/                  # Camada de acesso a dados
│   │   ├── productsService.js     # Chamadas à DummyJSON API
│   │   ├── ordersService.js       # CRUD pedidos no Supabase
│   │   ├── addressesService.js    # CRUD endereços no Supabase
│   │   └── wishlistService.js     # CRUD wishlist no Supabase
│   │
│   ├── hooks/                     # Custom hooks
│   │   ├── useProducts.js         # Fetch + paginação + filtro de produtos
│   │   ├── useProduct.js          # Fetch produto por ID
│   │   └── useAuth.js             # Listener de sessão Supabase → Zustand
│   │
│   ├── utils/                     # Funções utilitárias puras
│   │   ├── formatCurrency.js      # Formata número para R$ X,XX
│   │   ├── formatDate.js          # Formata datas
│   │   └── calculateDiscount.js   # Calcula preço com desconto
│   │
│   ├── styles/
│   │   └── globals.css            # CSS custom properties + reset
│   │
│   ├── App.jsx                    # Router + Routes
│   ├── App.css
│   └── main.jsx
│
├── .env                           # Variáveis de ambiente (não commitado)
├── .env.example                   # Template de variáveis
├── docs/
│   └── progresso/                 # Registro de progresso da implementação
└── vite.config.js
```

---

## State Management (Zustand)

### useCartStore
```js
{
  items: [],           // [{ product, quantity, selectedSize, selectedColor }]
  addItem(product, qty, size, color),
  removeItem(productId),
  updateQuantity(productId, qty),
  clearCart(),
  // Computed (getters via selectors)
  getTotalItems(),
  getSubtotal(),
}
```

### useWishlistStore
```js
{
  items: [],           // [product]
  addItem(product),
  removeItem(productId),
  isInWishlist(productId),
  syncWithSupabase(userId),   // carrega wishlist do Supabase ao logar
}
```

### useAuthStore
```js
{
  user: null,          // Supabase User object
  session: null,       // Supabase Session
  setUser(user),
  setSession(session),
  clearAuth(),
}
```

---

## Routing (React Router DOM v6)

```jsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="produtos" element={<Products />} />
      <Route path="produto/:id" element={<ProductDetail />} />
      <Route path="login" element={<Login />} />
      <Route path="carrinho" element={<Cart />} />
      <Route path="lista-de-desejos" element={<Wishlist />} />
      <Route path="checkout" element={<Checkout />} />
      <Route path="pedido-recebido" element={<OrderReceived />} />
      <Route element={<PrivateRoute />}>
        <Route path="minha-conta" element={<MyAccount />} />
        <Route path="minha-conta/pedidos" element={<Orders />} />
        <Route path="minha-conta/pedidos/:id" element={<OrderDetail />} />
        <Route path="minha-conta/enderecos" element={<Addresses />} />
        <Route path="minha-conta/detalhes" element={<AccountDetails />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
</BrowserRouter>
```

---

## Mercado Pago Integration

### Flow
1. User fills billing details and clicks "Finalizar Compra"
2. Frontend calls a Supabase Edge Function `create-preference`
3. Edge Function uses server-side SDK to create a Preference with items from cart
4. Returns `init_point` URL
5. Frontend saves order to Supabase (status: "pendente") and redirects to `init_point`
6. Mercado Pago processes payment and redirects back to:
   - Success: `/pedido-recebido?order_id=XXX`
   - Failure: `/checkout?error=true`
   - Pending: `/checkout?pending=true`
7. On success page, order status is updated to "pago"

### Supabase Edge Function: `create-preference`
```js
// supabase/functions/create-preference/index.ts
import { MercadoPagoConfig, Preference } from 'npm:mercadopago'

const client = new MercadoPagoConfig({ accessToken: Deno.env.get('MP_ACCESS_TOKEN') })

// Receives: { items, payer, back_urls, external_reference }
// Returns: { init_point }
```

---

## Supabase Schema

### Table: profiles
```sql
id uuid references auth.users primary key
full_name text
display_name text
avatar_url text
created_at timestamptz default now()
```

### Table: addresses
```sql
id uuid primary key default gen_random_uuid()
user_id uuid references auth.users
type text -- 'billing' | 'shipping'
first_name text
last_name text
company text
address text
number text
city text
state text
zip_code text
country text
phone text
created_at timestamptz default now()
```

### Table: orders
```sql
id uuid primary key default gen_random_uuid()
user_id uuid references auth.users
mp_preference_id text
mp_payment_id text
status text -- 'pendente' | 'pago' | 'cancelado'
subtotal numeric
total numeric
payment_method text
billing_address jsonb
notes text
created_at timestamptz default now()
```

### Table: order_items
```sql
id uuid primary key default gen_random_uuid()
order_id uuid references orders
product_id integer
product_title text
product_thumbnail text
quantity integer
unit_price numeric
total_price numeric
```

### Table: wishlists
```sql
id uuid primary key default gen_random_uuid()
user_id uuid references auth.users
product_id integer
product_title text
product_thumbnail text
product_price numeric
created_at timestamptz default now()
```

---

## DummyJSON API Service

```js
const BASE_URL = 'https://dummyjson.com'

export const getProducts = (limit = 12, skip = 0) =>
  fetch(`${BASE_URL}/products?limit=${limit}&skip=${skip}`).then(r => r.json())

export const searchProducts = (q) =>
  fetch(`${BASE_URL}/products/search?q=${encodeURIComponent(q)}`).then(r => r.json())

export const getCategories = () =>
  fetch(`${BASE_URL}/products/categories`).then(r => r.json())

export const getProductsByCategory = (category) =>
  fetch(`${BASE_URL}/products/category/${category}`).then(r => r.json())

export const getProductById = (id) =>
  fetch(`${BASE_URL}/products/${id}`).then(r => r.json())
```

---

## CSS Architecture

- **CSS Modules** per component: `ComponentName.module.css`
- **Global variables** in `src/styles/globals.css`:
  ```css
  :root {
    --color-primary: #1a472a;
    --color-primary-medium: #2d6a4f;
    --color-accent: #52b788;
    --color-white: #ffffff;
    --color-gray-100: #f8f9fa;
    --color-gray-200: #e9ecef;
    --color-text: #212529;
    --color-text-muted: #6c757d;
    --font-family: 'Inter', 'Roboto', sans-serif;
    --border-radius: 8px;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.12);
    --shadow-md: 0 4px 12px rgba(0,0,0,0.15);
    --transition: 0.2s ease;
  }
  ```
- No global class name collisions — modules handle scoping
- Responsive breakpoints: 1280px (desktop), 768px (tablet), 480px (mobile)
