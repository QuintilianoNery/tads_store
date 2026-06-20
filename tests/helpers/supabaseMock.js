// Helper de teste: cria um "query builder" do Supabase encadeável e aguardável.
// Todos os métodos de filtro retornam o próprio builder; `await builder`,
// `.single()` e `.maybeSingle()` resolvem para o { data, error } informado.
import { vi } from 'vitest';

export function makeQuery(result = { data: null, error: null }) {
  const q = {};
  ['select', 'insert', 'update', 'upsert', 'delete', 'eq', 'order', 'limit'].forEach((m) => {
    q[m] = vi.fn(() => q);
  });
  q.single = vi.fn(() => Promise.resolve(result));
  q.maybeSingle = vi.fn(() => Promise.resolve(result));
  q.then = (resolve, reject) => Promise.resolve(result).then(resolve, reject);
  return q;
}
