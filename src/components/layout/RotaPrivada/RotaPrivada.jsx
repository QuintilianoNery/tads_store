// src/components/layout/RotaPrivada/RotaPrivada.jsx
// Redireciona para /login se o usuário não estiver autenticado
import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '@/store/authStore'
import Spinner from '@/components/ui/Spinner/Spinner'

/**
 * Protege rotas que exigem autenticação.
 * Preserva a URL tentada para redirecionar após login.
 */
function RotaPrivada({ children }) {
  const { session, isLoading } = useAuthStore()
  const location = useLocation()

  // Ainda verificando sessão do Supabase
  if (isLoading) {
    return <Spinner message="Verificando autenticação..." />
  }

  // Não autenticado: redireciona para login, preservando destino
  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default RotaPrivada
