// src/App.jsx
// Roteamento da TADS Store — porta fiel do protótipo (TADS Store offline).
// Estado de carrinho/favoritos/usuário/busca em memória via StoreProvider.
// Telas carregadas sob demanda (code-splitting) com fallback usando o Spinner do DS.
import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'

import { StoreProvider } from '@/context/StoreContext'
import { Spinner } from '@/components/ds'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import RotaProtegida from '@/components/RotaProtegida'

const Home     = lazy(() => import('@/screens/Home'))
const Catalog  = lazy(() => import('@/screens/Catalog'))
const Detail   = lazy(() => import('@/screens/Detail'))
const Cart     = lazy(() => import('@/screens/Cart'))
const Checkout = lazy(() => import('@/screens/Checkout'))
const Login    = lazy(() => import('@/screens/Login'))
const Account  = lazy(() => import('@/screens/Account'))
const Wishlist = lazy(() => import('@/screens/Wishlist'))
const Help     = lazy(() => import('@/screens/Help'))

// Fallback centralizado enquanto a tela carrega.
function ScreenFallback() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <Spinner size={40} />
    </div>
  )
}

// Shell: Header (sticky) → conteúdo da rota → Footer.
function Layout() {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<ScreenFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index                  element={<Home />} />
            <Route path="produtos"        element={<Catalog />} />
            <Route path="produto/:id"     element={<Detail />} />
            <Route path="carrinho"        element={<Cart />} />
            <Route path="checkout"        element={<RotaProtegida><Checkout /></RotaProtegida>} />
            <Route path="login"           element={<Login />} />
            <Route path="lista-de-desejos" element={<Wishlist />} />
            <Route path="minha-conta"     element={<RotaProtegida><Account /></RotaProtegida>} />
            <Route path="ajuda"           element={<Help />} />
            <Route path="*"               element={<Home />} />
          </Route>
        </Routes>
      </StoreProvider>
    </BrowserRouter>
  )
}

export default App
