// Testes do serviço de avaliações (mock do cliente Supabase).
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { makeQuery } from '../helpers/supabaseMock';

const { from } = vi.hoisted(() => ({ from: vi.fn() }));
vi.mock('@/services/supabase', () => ({ supabase: { from }, default: { from } }));

import { getProductReviews, getUserReviews, upsertReview } from '@/services/reviewService';

beforeEach(() => { from.mockReset(); });

describe('getProductReviews', () => {
  it('filtra pelo produto e ordena por data', async () => {
    const query = makeQuery({ data: [{ id: 'r1', rating: 5 }], error: null });
    from.mockReturnValue(query);

    const result = await getProductReviews(7);

    expect(result).toEqual([{ id: 'r1', rating: 5 }]);
    expect(query.eq).toHaveBeenCalledWith('product_id', 7);
    expect(query.order).toHaveBeenCalledWith('created_at', { ascending: false });
  });

  it('propaga erro do Supabase', async () => {
    from.mockReturnValue(makeQuery({ data: null, error: new Error('boom') }));
    await expect(getProductReviews(7)).rejects.toThrow('boom');
  });

  it('retorna lista vazia quando data é nulo', async () => {
    from.mockReturnValue(makeQuery({ data: null, error: null }));
    expect(await getProductReviews(7)).toEqual([]);
  });
});

describe('getUserReviews', () => {
  it('filtra pelas avaliações do usuário', async () => {
    const query = makeQuery({ data: [{ id: 'r1', product_id: 7 }], error: null });
    from.mockReturnValue(query);

    const result = await getUserReviews('user-1');

    expect(result).toHaveLength(1);
    expect(query.eq).toHaveBeenCalledWith('user_id', 'user-1');
  });

  it('propaga erro do Supabase', async () => {
    from.mockReturnValue(makeQuery({ data: null, error: new Error('falha') }));
    await expect(getUserReviews('user-1')).rejects.toThrow('falha');
  });
});

describe('upsertReview', () => {
  it('faz upsert da avaliação por (user, produto)', async () => {
    const saved = { id: 'r1', product_id: 7, rating: 4 };
    const query = makeQuery({ data: saved, error: null });
    from.mockReturnValue(query);

    const result = await upsertReview({ userId: 'user-1', productId: 7, orderId: 'o1', rating: 4, comment: 'bom', authorName: 'Ana' });

    expect(result).toEqual(saved);
    expect(query.upsert).toHaveBeenCalledWith(
      {
        user_id: 'user-1',
        product_id: 7,
        order_id: 'o1',
        rating: 4,
        comment: 'bom',
        author_name: 'Ana',
      },
      { onConflict: 'user_id,product_id' }
    );
  });

  it('propaga erro do Supabase', async () => {
    from.mockReturnValue(makeQuery({ data: null, error: new Error('insert falhou') }));
    await expect(upsertReview({ userId: 'user-1', productId: 7, rating: 5 })).rejects.toThrow('insert falhou');
  });
});
