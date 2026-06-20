// src/components/RotaProtegida.jsx
// Protege rotas que exigem usuário autenticado. Redireciona para /login
// preservando a rota pretendida (para retornar a ela após o login).
import { Navigate, useLocation } from 'react-router-dom';
import { Spinner } from '@/components/ds';
import { useStore } from '@/context/StoreContext';

export default function RotaProtegida({ children }) {
  const { user, authInitializing } = useStore();
  const location = useLocation();

  // Ainda restaurando a sessão do Supabase (ex.: após reload da página).
  if (authInitializing) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Spinner size={40} />
      </div>
    );
  }

  // Não autenticado: manda para o login guardando o destino pretendido.
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
