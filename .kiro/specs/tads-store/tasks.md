# Implementation Plan: TADS Store

## Overview

This plan implements a full e-commerce SPA (Single Page Application) using React + Vite. The implementation follows a bottom-up approach: infrastructure and shared utilities first, then global state stores, then reusable UI primitives, then layout shell, then feature pages (home, catalog, detail, auth, account, cart, checkout, wishlist), and finally documentation and polish. Each task builds directly on the previous ones so no code is left unintegrated.

## Tasks

- [x] 1. Project Setup & Infrastructure
  - Install dependencies, configure environment files, set up global CSS variables, initialize Supabase client and Mercado Pago utilities, and restructure the project folders.
  - [x] 1.1 Install required dependencies: `react-router-dom`, `zustand`, `@supabase/supabase-js`
    - _Requirements: 1.3_
  - [x] 1.2 Create `.env.example` with placeholder variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_MP_ACCESS_TOKEN`, `VITE_MP_PUBLIC_KEY`)
    - _Requirements: 1.1, 1.2_
  - [x] 1.3 Create `src/styles/globals.css` with CSS custom properties (color palette, typography, spacing)
    - _Requirements: 2_
  - [x] 1.4 Create `src/lib/supabase.js` — initialize and export Supabase client
    - _Requirements: 1.2_
  - [x] 1.5 Create `src/lib/mercadopago.js` — document that this is server-side only; export a helper to call the Supabase Edge Function
    - _Requirements: 1.1_
  - [x] 1.6 Create `src/services/productsService.js` — all DummyJSON API calls
    - _Requirements: 7, 9_
  - [x] 1.7 Create `src/utils/formatCurrency.js`, `formatDate.js`, `calculateDiscount.js`
    - _Requirements: 8, 13, 17_
  - [x] 1.8 Update `vite.config.js` to support environment variables
    - _Requirements: 1.1, 1.2_
  - [x] 1.9 Update `src/main.jsx` to import global CSS
    - _Requirements: 2, 21_
  - [x] 1.10 Create empty directory structure: `components/`, `pages/`, `store/`, `hooks/`, `services/`, `utils/`
    - _Requirements: 21_

- [x] 2. Zustand Stores
  - Create the three global state stores.
  - [x] 2.1 Create `src/store/useCartStore.js` with actions: addItem, removeItem, updateQuantity, clearCart and computed getters
    - _Requirements: 17_
  - [x] 2.2 Create `src/store/useWishlistStore.js` with actions: addItem, removeItem, isInWishlist, syncWithSupabase
    - _Requirements: 16_
  - [x] 2.3 Create `src/store/useAuthStore.js` with fields: user, session and actions: setUser, setSession, clearAuth
    - _Requirements: 11_

- [x] 3. Core Reusable Components (UI Primitives)
  - Build the smallest UI building blocks.
  - [x] 3.1 Create `Button` component with variants (primary, secondary, outline) and CSS Module
    - _Requirements: 21_
  - [x] 3.2 Create `Badge` component for discount/promo labels and CSS Module
    - _Requirements: 8_
  - [x] 3.3 Create `StarRating` component (0–5 stars display) and CSS Module
    - _Requirements: 8_
  - [x] 3.4 Create `Pagination` component with numeric pages and next/prev controls and CSS Module
    - _Requirements: 7_
  - [x] 3.5 Create `Breadcrumb` component that reads current route and CSS Module
    - _Requirements: 3_

- [x] 4. Layout Components
  - Build the Layout shell, Header, Footer and routing structure.
  - [x] 4.1 Create `Footer` component with copyright text and optional links, and CSS Module
    - _Requirements: 5_
  - [x] 4.2 Create `MiniCart` dropdown component showing cart items, subtotal, View Cart and Checkout buttons, and CSS Module
    - _Requirements: 4, 17_
  - [x] 4.3 Create `CategoryPanel` slide-in component for "All Categories", and CSS Module
    - _Requirements: 4_
  - [x] 4.4 Create `Header` component with logo, search bar with category selector, wishlist icon + count, cart icon + count + MiniCart, topbar with auth state (Supabase), and main nav. CSS Module.
    - _Requirements: 4_
  - [x] 4.5 Create `Layout` component wrapping Header + `<main children>` + Footer + Breadcrumb. CSS Module.
    - _Requirements: 3_
  - [x] 4.6 Create `PrivateRoute` component that checks Supabase session via useAuthStore and redirects to `/login` if unauthenticated
    - _Requirements: 12_

- [x] 5. Authentication Hook & useAuth
  - Wire Supabase auth listener to Zustand.
  - [x] 5.1 Create `src/hooks/useAuth.js` — subscribes to `supabase.auth.onAuthStateChange`, updates useAuthStore on login/logout
    - _Requirements: 11_
  - [x] 5.2 Call `useAuth()` in the root `App.jsx` to bootstrap auth state on app load
    - _Requirements: 11_

- [x] 6. App Router Setup
  - Configure all routes in App.jsx.
  - [x] 6.1 Rewrite `App.jsx` to use BrowserRouter + Routes with the full route tree (all public + protected routes), using Layout as the parent route wrapper
    - _Requirements: 3, 12, 20_

- [ ] 7. Home Page
  - Build the home page with all sections.
  - [x] 7.1 Create Hero Banner section (static image + promotional text) with CSS Module
    - _Requirements: 6_
  - [x] 7.2 Create 4 smaller category promo banners grid
    - _Requirements: 6_
  - [x] 7.3 Create "Produtos Sugeridos" horizontal scroll section fetching from DummyJSON
    - _Requirements: 6_
  - [x] 7.4 Create "Produtos em Destaque" tabbed section (by category) with up to 8 products and "View All" button
    - _Requirements: 6_
  - [x] 7.5 Create "Notícias Recentes" section (static data)
    - _Requirements: 6_
  - [x] 7.6 Create "Depoimentos" section (static data)
    - _Requirements: 6_
  - [ ] 7.7 Assemble `Home.jsx` page with all sections. CSS Module.
    - _Requirements: 6_

- [ ] 8. Product Components & Catalog Page
  - Build ProductCard, QuickView modal, FavoriteButton, and the Products catalog page.
  - [ ] 8.1 Create `FavoriteButton` component integrated with useWishlistStore. CSS Module.
    - _Requirements: 8, 16_
  - [ ] 8.2 Create `QuickView` modal component with image, title, price, size/color selectors, Add to Cart. CSS Module.
    - _Requirements: 8_
  - [ ] 8.3 Create `ProductCard` component: thumbnail, title, StarRating, price (formatted R$), discount price strikethrough, Badge, FavoriteButton, Add to Cart button, link to detail page, Quick View trigger. CSS Module.
    - _Requirements: 8_
  - [ ] 8.4 Create `ProductGrid` component with loading, error, and empty states. CSS Module.
    - _Requirements: 7, 21_
  - [ ] 8.5 Create `src/hooks/useProducts.js` — fetches products with pagination + category filter + search term using DummyJSON
    - _Requirements: 7, 10_
  - [ ] 8.6 Create `Products.jsx` page with grid/list toggle, sort selector, ProductGrid, and Pagination. CSS Module.
    - _Requirements: 7_

- [ ] 9. Product Detail Page
  - Build the full product detail page.
  - [ ] 9.1 Create `src/hooks/useProduct.js` — fetches a single product by ID from DummyJSON
    - _Requirements: 9_
  - [ ] 9.2 Create `ProductDetail.jsx` with: image gallery + thumbnails + zoom, title, rating, price, description, size selector, color selector, stock info, quantity selector, Add to Cart, Add to Wishlist, product tabs (Descrição, Informação adicional, Avaliações), breadcrumb, prev/next navigation. CSS Module.
    - _Requirements: 9_

- [ ] 10. Authentication Pages
  - Build Login and Register forms using Supabase Auth.
  - [ ] 10.1 Create `Login.jsx` page with two side-by-side forms: Login form (email/username + password + remember me + Login button + lost password link) and Register form (email + password + Register button). Use Supabase `signInWithPassword` and `signUp`. CSS Module.
    - _Requirements: 11_

- [ ] 11. My Account & Protected Pages
  - Build the user account area.
  - [ ] 11.1 Create `MyAccount.jsx` with side nav (Painel, Pedidos, Endereços, Detalhes da Conta, Sair) and Painel greeting. CSS Module.
    - _Requirements: 12_
  - [ ] 11.2 Create `src/services/ordersService.js` — CRUD for orders in Supabase
    - _Requirements: 13_
  - [ ] 11.3 Create `Orders.jsx` page fetching orders from Supabase, showing table with Visualizar button. CSS Module.
    - _Requirements: 13_
  - [ ] 11.4 Create `OrderDetail.jsx` page with order details, items table, totals, billing address. CSS Module.
    - _Requirements: 13_
  - [ ] 11.5 Create `src/services/addressesService.js` — CRUD for addresses in Supabase
    - _Requirements: 14_
  - [ ] 11.6 Create `Addresses.jsx` page with billing and shipping address blocks + Edit button. CSS Module.
    - _Requirements: 14_
  - [ ] 11.7 Create `AccountDetails.jsx` page with personal data form + password change section, using Supabase `updateUser`. CSS Module.
    - _Requirements: 15_

- [ ] 12. Wishlist Page
  - Build the wishlist page.
  - [ ] 12.1 Create `src/services/wishlistService.js` — CRUD for wishlist items in Supabase
    - _Requirements: 16_
  - [ ] 12.2 Create `Wishlist.jsx` page with product table, Add to Cart, Remove buttons, empty state, synced with useWishlistStore and Supabase. CSS Module.
    - _Requirements: 16_

- [ ] 13. Cart Page
  - Build the shopping cart page.
  - [ ] 13.1 Create `Cart.jsx` page with: product table (image, name, price, quantity controls, line total, remove), coupon code field, Update Cart button, cart summary (subtotal, total, Concluir Compra button). CSS Module.
    - _Requirements: 17_

- [ ] 14. Checkout & Mercado Pago Integration
  - Build the checkout form and integrate Mercado Pago Checkout Pro.
  - [ ] 14.1 Create billing details form (all required fields per RF16)
    - _Requirements: 18_
  - [ ] 14.2 Create order summary sidebar showing cart items
    - _Requirements: 18_
  - [ ] 14.3 Implement "Finalizar Compra" logic: validate form → save order to Supabase (status: "pendente") → call `lib/mercadopago.js` helper to get `init_point` from Supabase Edge Function → redirect to Mercado Pago
    - _Requirements: 18_
  - [ ] 14.4 Create `Checkout.jsx` page assembling all checkout sections. CSS Module.
    - _Requirements: 18_
  - [ ] 14.5 Document the required Supabase Edge Function `create-preference` in `docs/progresso/` — provide the full Edge Function code so the user can deploy it to Supabase
    - _Requirements: 1.1, 18_

- [ ] 15. Order Received Page & 404
  - Build confirmation and error pages.
  - [ ] 15.1 Create `OrderReceived.jsx` — reads `order_id` from URL query param, loads order from Supabase, displays confirmation, clears cart. CSS Module.
    - _Requirements: 19_
  - [ ] 15.2 Create `NotFound.jsx` — 404 page with back to Home link. CSS Module.
    - _Requirements: 20_

- [ ] 16. Search Integration
  - Wire the header search bar to the Products page.
  - [ ] 16.1 Update `Header` to push search term and category to URL query params on submit
    - _Requirements: 10_
  - [ ] 16.2 Update `useProducts` hook to read `q` and `category` from URL query params and call the appropriate DummyJSON endpoint
    - _Requirements: 10_

- [ ] 17. Supabase Schema & Edge Function Documentation
  - Document the database setup and Edge Function.
  - [ ] 17.1 Create `docs/progresso/003_supabase_schema.sql` with all CREATE TABLE statements
    - _Requirements: 1.2_
  - [ ] 17.2 Create `docs/progresso/004_edge_function_create_preference.md` with complete Edge Function code and deploy instructions
    - _Requirements: 1.1, 18_
  - [ ] 17.3 Create `docs/progresso/005_mercadopago_setup.md` documenting how to get Mercado Pago credentials and configure the `.env`
    - _Requirements: 1.1_

- [ ] 18. Final Polish & README
  - Finalize the project.
  - [ ] 18.1 Update `README.md` with: project description, how to run, environment variables setup, Supabase setup steps, Mercado Pago setup steps, test credentials
    - _Requirements: 21_
  - [ ] 18.2 Verify all routes work, all loading/error states render, all CSS Modules are correctly scoped
    - _Requirements: 21_
  - [ ] 18.3 Create `docs/progresso/002_estrutura_pastas.md` documenting the final folder structure
    - _Requirements: 21_

- [ ] 19. Final Checkpoint
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks 1–6 are fully complete. Implementation begins at task 7.
- No property-based tests are included — the design document has no Correctness Properties section (this is a UI/CRUD feature). Unit and integration tests are optional but recommended for service modules.
- Tasks marked with `*` (if added in future) would be optional and can be skipped for a faster MVP.
- Each task references specific requirements from `requirements.md` for traceability.
- Checkpoints ensure incremental validation throughout the build.
- The Mercado Pago integration requires a Supabase Edge Function to be deployed manually — see task 14.5 and 17.2.
- All CSS must use CSS Modules (`.module.css`) — no global class names except those defined in `globals.css`.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["7.2", "7.3", "7.4", "7.5", "7.6"] },
    { "id": 1, "tasks": ["7.7", "8.1", "8.2", "8.4", "8.5", "9.1", "11.2", "11.5", "12.1"] },
    { "id": 2, "tasks": ["8.3", "8.6", "9.2", "10.1", "11.1", "11.3", "11.4", "11.6", "11.7", "12.2", "13.1"] },
    { "id": 3, "tasks": ["14.1", "14.2", "16.1", "16.2"] },
    { "id": 4, "tasks": ["14.3", "14.5"] },
    { "id": 5, "tasks": ["14.4", "15.1", "15.2"] },
    { "id": 6, "tasks": ["17.1", "17.2", "17.3"] },
    { "id": 7, "tasks": ["18.1", "18.2", "18.3"] }
  ]
}
```
