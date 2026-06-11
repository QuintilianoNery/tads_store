// src/store/authStore.js
// Estado global de autenticação — sincronizado com Supabase JWT
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { signIn, signUp, signOut, onAuthStateChange } from '@/services/authService'

const useAuthStore = create(
  persist(
    (set, get) => ({
      // ─── Estado ───────────────────────────────────────────────
      user: null,
      session: null,
      isLoading: false,
      error: null,

      // ─── Computed ─────────────────────────────────────────────
      isAuthenticated: () => !!get().session,

      // ─── Actions ──────────────────────────────────────────────

      /** Inicializa o listener de auth do Supabase. Chamar em App.jsx. */
      initAuth: () => {
        const unsubscribe = onAuthStateChange((session) => {
          set({
            session,
            user: session?.user ?? null,
          })
        })
        return unsubscribe
      },

      /** Login com email + senha */
      login: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          const { user, session } = await signIn({ email, password })
          set({ user, session, isLoading: false })
          return { success: true }
        } catch (err) {
          const message = parseAuthError(err.message)
          set({ error: message, isLoading: false })
          return { success: false, error: message }
        }
      },

      /** Cadastro com nome, email + senha */
      register: async (fullName, email, password) => {
        set({ isLoading: true, error: null })
        try {
          await signUp({ fullName, email, password })
          set({ isLoading: false })
          return { success: true, needsConfirmation: true }
        } catch (err) {
          const message = parseAuthError(err.message)
          set({ error: message, isLoading: false })
          return { success: false, error: message }
        }
      },

      /** Logout — limpa sessão e estado */
      logout: async () => {
        set({ isLoading: true })
        try {
          await signOut()
        } finally {
          set({ user: null, session: null, isLoading: false, error: null })
        }
      },

      /** Limpa o erro atual */
      clearError: () => set({ error: null }),

      /** Atualiza o usuário após edição de perfil */
      setUser: (user) => set({ user }),
    }),
    {
      name: 'tads-store-auth',
      // Persiste apenas dados não-sensíveis; o JWT é gerenciado pelo Supabase
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
)

// Traduz mensagens de erro do Supabase para português
function parseAuthError(message) {
  const map = {
    'Invalid login credentials': 'E-mail ou senha incorretos.',
    'Email not confirmed': 'Confirme seu e-mail antes de fazer login.',
    'User already registered': 'Este e-mail já está cadastrado.',
    'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres.',
    'Unable to validate email address: invalid format': 'Formato de e-mail inválido.',
  }
  return map[message] ?? 'Ocorreu um erro. Tente novamente.'
}

export default useAuthStore
