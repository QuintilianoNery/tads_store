// src/services/addressService.js
// Camada de acesso aos endereços salvos do usuário (tabela public.addresses).
// Toda leitura/escrita de endereço passa por aqui, convertendo entre o formato
// do banco (snake_case) e o formato usado na aplicação (camelCase).
import { supabase } from './supabase'

/** Forma vazia padrão de um endereço na aplicação. */
export const EMPTY_ADDRESS = {
  firstName: '', lastName: '', company: '',
  address: '', number: '', city: '', state: '',
  cep: '', country: 'Brasil', phone: '',
}

/** Linha do banco (snake_case) → objeto da aplicação (camelCase). */
function fromRow(row) {
  if (!row) return null
  return {
    id:        row.id,
    type:      row.type,
    firstName: row.first_name ?? '',
    lastName:  row.last_name ?? '',
    company:   row.company ?? '',
    address:   row.address ?? '',
    number:    row.number ?? '',
    city:      row.city ?? '',
    state:     row.state ?? '',
    cep:       row.zip_code ?? '',
    country:   row.country ?? 'Brasil',
    phone:     row.phone ?? '',
  }
}

/** Objeto da aplicação (camelCase) → colunas do banco (snake_case). */
function toColumns({ userId, type, data }) {
  const clean = (v) => (typeof v === 'string' ? v.trim() : v) || null
  return {
    user_id:    userId,
    type,
    first_name: clean(data.firstName),
    last_name:  clean(data.lastName),
    company:    clean(data.company),
    address:    clean(data.address),
    number:     clean(data.number),
    city:       clean(data.city),
    state:      clean(data.state),
    zip_code:   clean(data.cep),
    country:    clean(data.country),
    phone:      clean(data.phone),
  }
}

/**
 * Retorna os endereços do usuário indexados por tipo.
 * @param {string} userId
 * @returns {Promise<{ billing: object|null, shipping: object|null }>}
 */
export async function getAddresses(userId) {
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
  if (error) throw error

  const result = { billing: null, shipping: null }
  for (const row of data ?? []) {
    if (row.type in result && !result[row.type]) result[row.type] = fromRow(row)
  }
  return result
}

/**
 * Retorna o endereço preferencial do usuário para o checkout.
 * Prioriza o endereço de entrega; usa o de cobrança como alternativa.
 * @param {string} userId
 * @returns {Promise<object|null>}
 */
export async function getDefaultAddress(userId) {
  const { billing, shipping } = await getAddresses(userId)
  return shipping ?? billing ?? null
}

/**
 * Cria ou atualiza o endereço do usuário para o tipo informado.
 * A tabela não possui constraint única em (user_id, type), então buscamos
 * o id existente para decidir entre insert e update.
 * @returns {Promise<object>} O endereço salvo, no formato da aplicação.
 */
export async function saveAddress({ userId, type, data }) {
  const columns = toColumns({ userId, type, data })

  const { data: existing, error: selectError } = await supabase
    .from('addresses')
    .select('id')
    .eq('user_id', userId)
    .eq('type', type)
    .limit(1)
    .maybeSingle()
  if (selectError) throw selectError

  const query = existing
    ? supabase.from('addresses').update(columns).eq('id', existing.id)
    : supabase.from('addresses').insert(columns)

  const { data: saved, error } = await query.select().single()
  if (error) throw error
  return fromRow(saved)
}
