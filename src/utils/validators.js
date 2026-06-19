// src/utils/validators.js
// Validadores de formulário reutilizáveis em toda a aplicação.

/** Valida o formato de um e-mail (checagem prática, não RFC completa). */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

/** Verifica se um valor de texto não está vazio (após trim). */
export function isNotEmpty(value) {
  return String(value ?? '').trim().length > 0;
}

/** Senha mínima aceita pelo Supabase (6 caracteres). */
export const MIN_PASSWORD_LENGTH = 6;

/** Valida o comprimento mínimo de senha. */
export function isValidPassword(password) {
  return String(password ?? '').length >= MIN_PASSWORD_LENGTH;
}
