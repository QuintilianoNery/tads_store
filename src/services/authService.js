// src/services/authService.js
// Todas as operações de autenticação passam por aqui
import { supabase } from './supabase'

/**
 * Registra um novo usuário com email e senha.
 * O Supabase envia e-mail de confirmação automaticamente.
 */
export async function signUp({ email, password, fullName }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        display_name: fullName,
      },
    },
  })
  if (error) throw error
  return data
}

/**
 * Faz login com email e senha.
 * Retorna { user, session } — session.access_token é o JWT.
 */
export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

/**
 * Faz logout e invalida o token JWT no servidor.
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/**
 * Retorna a sessão atual (com JWT) ou null se não logado.
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

/**
 * Retorna o usuário autenticado atual ou null.
 */
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser()
  if (error) return null
  return data.user
}

/**
 * Atualiza o perfil do usuário (nome, email).
 */
export async function updateProfile({ fullName, email }) {
  const { data, error } = await supabase.auth.updateUser({
    email,
    data: { full_name: fullName, display_name: fullName },
  })
  if (error) throw error
  return data
}

/**
 * Envia e-mail de redefinição de senha.
 */
export async function resetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/nova-senha`,
  })
  if (error) throw error
}

/**
 * Listener de mudança de estado de autenticação.
 * Retorna função de cleanup para usar em useEffect.
 */
export function onAuthStateChange(callback) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session)
  })
  // Retorna o unsubscribe para cleanup
  return () => data.subscription.unsubscribe()
}
