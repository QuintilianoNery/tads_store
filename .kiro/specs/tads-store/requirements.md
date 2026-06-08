# TADS Store — Requirements

## Overview
E-commerce SPA (Single Page Application) para o projeto integrador de Desenvolvimento Front-End II do IFES Campus de Alegre. Utiliza React + Vite, consome a API DummyJSON, tem autenticação real via Supabase (JWT) e checkout via Mercado Pago Checkout Pro.

---

## Requirements

### 1. Configuração do Projeto e Infraestrutura

#### 1.1 Mercado Pago — Configuração SDK
- MUST configure the Mercado Pago SDK with access token via environment variable `VITE_MP_ACCESS_TOKEN`
- MUST create a backend utility (`src/lib/mercadopago.js`) that initializes `MercadoPagoConfig` and exports `Preference`
- MUST create a Vite-compatible server-side preference creation endpoint or use a Supabase Edge Function for generating the preference (since Mercado Pago SDK requires a server-side access token)
- MUST store all credentials exclusively in `.env` — never hardcoded

#### 1.2 Supabase — Configuração
- MUST initialize Supabase client in `src/lib/supabase.js` using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- MUST configure Supabase Auth for email/password registration and login
- MUST use Supabase JWT for protecting routes and user session persistence
- MUST create the following tables in Supabase: `profiles`, `orders`, `order_items`, `addresses`, `wishlists`

#### 1.3 Dependências
- MUST install: `react-router-dom`, `zustand`, `@supabase/supabase-js`
- SDK `mercadopago` already installed (v3.1.0)
- MUST add `.env` to `.gitignore`
- MUST provide `.env.example` with placeholder values

---

### 2. Identidade Visual
- MUST use color palette: dark green `#1a472a`, medium green `#2d6a4f`, light green `#52b788`, white
- MUST use logo with hexagonal icon "TA" + arrow + "TADS STORE" text
- SHOULD use Inter or Roboto as the primary font
- MUST define CSS custom properties (variables) in a global CSS file for the palette

---

### 3. Layout Global (RF01)
- MUST have a `Layout` component that wraps all pages with Header + `<main>` + Footer
- MUST display a `Breadcrumb` below the header on all routes
- MUST render `children` inside `<main>`

---

### 4. Header (RF02)
- MUST display TADS Store logo
- MUST have a global search bar with category selector and "Search" button
- MUST display wishlist icon with item count
- MUST display cart icon with item count and total value
- MUST show "Sign up" and "Login" links when user is not logged in (via Supabase auth state)
- MUST show "Welcome [name]!" and "Logout" button when logged in
- MUST have main nav: Home, Comprar, Categorias, Mais Vendidos
- MUST have "All Categories" button that opens a side panel
- MUST have a mini-cart dropdown on hover/click showing items, subtotal, "View Cart" and "Checkout" buttons

---

### 5. Footer (RF03)
- MUST display copyright text: `© [year] TADS Store. Todos os direitos reservados.`
- SHOULD have links: Política de Privacidade, Termos de Uso

---

### 6. Home Page (RF04)
- MUST have a Hero Banner section
- MUST have 4 smaller category/promo banners beside the hero
- MUST have "Produtos Sugeridos" horizontal scroll section (data from DummyJSON)
- MUST have "Produtos em Destaque" grid with category filter tabs, up to 8 products
- MUST have "View All" button linking to `/produtos`
- MUST have "Notícias Recentes" section (static data acceptable)
- MUST have "Depoimentos" section (static data acceptable)

---

### 7. Product Catalog (RF05)
- MUST fetch products from DummyJSON `/products?limit=12&skip=0`
- MUST support grid and list view toggle
- MUST have sort selector: default, lowest price, highest price, A-Z, Z-A
- MUST display minimum 9 cards per page
- MUST have numeric pagination
- MUST show loading, error, and empty states

---

### 8. Product Card (RF06)
- MUST be a reusable component accepting a product object as prop
- MUST display thumbnail, title, star rating, price (formatted as R$), original price (strikethrough when discounted), discount badge
- MUST have favorite button (♡/♥) with Zustand wishlist integration
- MUST have "Add to Cart" button with Zustand cart integration
- MUST navigate to `/produto/:id` on click
- MUST support Quick View modal

---

### 9. Product Detail Page (RF07)
- MUST fetch product by ID from DummyJSON `/products/:id`
- MUST show image gallery with clickable thumbnails
- MUST show zoom on main image
- MUST show size and color selectors
- MUST show stock info, quantity selector
- MUST have "Add to Cart" and "Add to Wishlist" actions
- MUST show product tabs: Descrição, Informação adicional, Avaliações

---

### 10. Search & Filter (RF08)
- MUST have controlled search input synced with URL query params
- MUST filter by category
- MUST filter by text in real time using DummyJSON search endpoint
- MUST show "Nenhum produto encontrado" when empty

---

### 11. Authentication via Supabase (RF09)
- MUST use Supabase Auth for user registration (email + password)
- MUST use Supabase Auth for login — returns JWT
- MUST persist session using Supabase's built-in session management
- MUST redirect to `/minha-conta` on successful login
- MUST display error messages on login/register failure
- MUST support logout (clears Supabase session and Zustand user state)

---

### 12. My Account — Protected Area (RF10)
- MUST protect `/minha-conta` and sub-routes using a `RotaPrivada` component that checks Supabase auth state
- MUST redirect to `/login` if not authenticated
- MUST show side nav: Painel, Pedidos, Endereços, Detalhes da Conta, Sair
- MUST greet user: "Olá, [nome]!"

---

### 13. Orders (RF11)
- MUST display orders from Supabase `orders` table filtered by user ID
- MUST show table: Order #, Date, Status, Total, Actions
- MUST have "Visualizar" button per row opening order detail
- MUST show order detail with items, totals, billing address

---

### 14. Addresses (RF12)
- MUST display and edit billing and shipping addresses stored in Supabase `addresses` table
- MUST have "Edit" button per address block

---

### 15. Account Details (RF13)
- MUST allow updating first name, last name, display name, email via Supabase Auth update
- MUST allow changing password (current + new + confirm)
- MUST validate required fields before saving

---

### 16. Wishlist (RF14)
- MUST persist wishlist in Supabase `wishlists` table for logged-in users
- MUST fall back to Zustand local state for guest users
- MUST show table: image, product name, unit price, stock status, Add to Cart, Remove
- MUST update header counter in real time

---

### 17. Shopping Cart (RF15)
- MUST store cart in Zustand (client-side, no persistence needed for MVP)
- MUST show table: image, product, price, quantity, total, remove
- MUST have coupon code field (UI only for MVP)
- MUST have cart summary with subtotal, total, and "Concluir Compra" button
- MUST have mini-cart dropdown in header
- MUST update header counter on any cart change

---

### 18. Checkout via Mercado Pago (RF16)
- MUST collect billing details via form (name, address, phone, email, country, etc.)
- MUST validate all required fields
- MUST integrate Mercado Pago Checkout Pro:
  - Create a Preference object (server-side via Supabase Edge Function or Vite proxy)
  - Redirect user to Mercado Pago hosted checkout page
- MUST save order to Supabase `orders` table before redirecting
- Mercado Pago will handle payment methods (credit, debit, PIX, boleto, etc.)

---

### 19. Order Confirmation (RF17)
- MUST display on `/pedido-recebido` after successful payment callback from Mercado Pago
- MUST show: order number, date, email, total, payment method
- MUST clear the cart after confirmation

---

### 20. 404 Page (RF18)
- MUST render on any unmapped route (`path="*"`)
- MUST have a link back to Home

---

### 21. Non-Functional Requirements
- MUST use CSS Modules (`.module.css` per component)
- MUST use Zustand for global state (cart, user, wishlist)
- MUST use React Router DOM v6 for routing
- MUST handle all API calls with loading + error states
- MUST be responsive (min 1280px desktop, basic mobile support)
- MUST use `key={item.id}` on all `.map()` calls
- MUST separate `components/` from `pages/`
- MUST follow secure coding: no secrets in source, parameterized queries via Supabase SDK
