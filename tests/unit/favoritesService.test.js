// Testes do serviço de favoritos (mock do cliente Supabase).
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { makeQuery } from '../helpers/supabaseMock';

const { from } = vi.hoisted(() => ({ from: vi.fn() }));
vi.mock('@/services/supabase', () => ({ supabase: { from }, default: { from } }));

import { getFavorites, addFavorite, removeFavorite } from '@/services/favoritesService';

beforeEach(() => { from.mockReset(); });

describe('getFavorites', () => {
  it('retorna apenas os product_ids', async () => {
    from.mockReturnValue(makeQuery({ data: [{ product_id: 1 }, { product_id: 2 }], error: null }));
    expect(await getFavorites('user-1')).toEqual([1, 2]);
  });

  it('propaga erro do Supabase', async () => {
    from.mockReturnValue(makeQuery({ data: null, error: new Error('boom') }));
    await expect(getFavorites('user-1')).rejects.toThrow('boom');
  });
});

describe('addFavorite', () => {
  it('insere o favorito', async () => {
    const query = makeQuery({ error: null });
    from.mockReturnValue(query);

    await addFavorite('user-1', 7);

    expect(query.insert).toHaveBeenCalledWith({ user_id: 'user-1', product_id: 7 });
  });

  it('ignora violação de unicidade (23505 = já favoritado)', async () => {
    from.mockReturnValue(makeQuery({ error: { code: '23505' } }));
    await expect(addFavorite('user-1', 7)).resolves.toBeUndefined();
  });

  it('propaga outros erros', async () => {
    from.mockReturnValue(makeQuery({ error: { code: '42000', message: 'falha' } }));
    await expect(addFavorite('user-1', 7)).rejects.toMatchObject({ code: '42000' });
  });
});

describe('removeFavorite', () => {
  it('filtra por usuário e produto', async () => {
    const query = makeQuery({ error: null });
    from.mockReturnValue(query);

    await removeFavorite('user-1', 7);

    expect(query.delete).toHaveBeenCalled();
    expect(query.eq).toHaveBeenCalledWith('user_id', 'user-1');
    expect(query.eq).toHaveBeenCalledWith('product_id', 7);
  });
});
