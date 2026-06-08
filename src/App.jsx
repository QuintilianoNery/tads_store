// src/App.jsx
// Configuração central de rotas da TADS Store
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'

// Layout
import Layout from '@/components/layout/Layout/Layout'
import RotaPrivada from '@/components/layout/RotaPrivada/RotaPrivada'

// Páginas públicas
import Home           from '@/pages/Home'
import Produtos       from '@/pages/Produtos'
import Detalhe        from '@/pages/Detalhe'
import Login          from '@/pages/Login'
import Carrinho       from '@/pages/Carrinho'
import ListaDesejos   from '@/pages/ListaDesejos'
import Checkout       from '@/pages/Checkout'
import PedidoRecebido from '@/pages/PedidoRecebido'
import NaoEncontrado  from '@/pages/NaoEncontrado'

// Páginas protegidas
import MinhaConta, { Painel } from '@/pages/MinhaConta'
import Pedidos        from '@/pages/conta/Pedidos'
import Enderecos      from '@/pages/conta/Enderecos'
import DetalhesConta  from '@/pages/conta/DetalhesConta'

// Auth store
import useAuthStore from '@/store/authStore'

function App() {
  const initAuth = useAuthStore((s) => s.initAuth)

  // Inicializa o listener do Supabase Auth uma única vez
  useEffect(() => {
    const unsubscribe = initAuth()
    return unsubscribe
  }, [initAuth])

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* ── Rotas públicas ── */}
          <Route index               element={<Home />} />
          <Route path="produtos"     element={<Produtos />} />
          <Route path="produto/:id"  element={<Detalhe />} />
          <Route path="login"        element={<Login />} />
          <Route path="carrinho"     element={<Carrinho />} />
          <Route path="lista-de-desejos" element={<ListaDesejos />} />
          <Route path="checkout"     element={<Checkout />} />
          <Route path="pedido-recebido" element={<PedidoRecebido />} />

          {/* ── Rotas protegidas — Minha Conta ── */}
          <Route
            path="minha-conta"
            element={
              <RotaPrivada>
                <MinhaConta />
              </RotaPrivada>
            }
          >
            {/* Painel (index da área logada) */}
            <Route index element={<Painel />} />

            {/* Sub-rotas da conta */}
            <Route path="pedidos"  element={<Pedidos />} />
            <Route path="enderecos" element={<Enderecos />} />
            <Route path="detalhes" element={<DetalhesConta />} />
          </Route>

          {/* ── 404 ── */}
          <Route path="*" element={<NaoEncontrado />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
