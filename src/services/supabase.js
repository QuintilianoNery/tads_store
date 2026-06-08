// src/services/supabase.js
// Cliente Supabase centralizado — importe daqui em toda a aplicação
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '❌ Variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não encontradas.\n' +
    'Copie .env.example para .env e preencha com seus dados do Supabase.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Persiste a sessão no localStorage automaticamente
    persistSession: true,
    // Atualiza o token JWT automaticamente antes de expirar
    autoRefreshToken: true,
    // Detecta mudança de sessão em outras abas
    detectSessionInUrl: true,
  },
})

export default supabase
