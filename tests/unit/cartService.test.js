// Testes do serviço de carrinho (mock do cliente Supabase).
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { makeQuery } from '../helpers/supabaseMock';

const { from } = vi.hoisted(() => ({ from: vi.fn() }));
vi.mock('@/services/supabase', () => ({ supabase: { from }, default: { from } }));

import { getCart, setCartItem, removeCartItem, clearCart } from '@/services/cartService';

beforeEach(() => { from.mockReset(); });

describe('getCart', () => {
  it('mapeia as linhas para { product, qty }', async () => {
    const product = { id: 1, title: 'Fone' };
    from.mockReturnValue(makeQuery({ data: [{ product, quantity: 2 }], error: null }));

    const result = await getCart('user-1');

    expect(from).toHaveBeenCalledWith('cart_items');
    expect(result).toEqual([{ product, qty: 2 }]);
  });

  it('retorna lista vazia quando não há dados', async () => {
    from.mockReturnValue(makeQuery({ data: null, error: null }));
    expect(await getCart('user-1')).toEqual([]);
  });

  it('propaga erro do Supabase', async () => {
    from.mockReturnValue(makeQuery({ data: null, error: new Error('boom') }));
    await expect(getCart('user-1')).rejects.toThrow('boom');
  });
});

describe('setCartItem', () => {
  it('faz upsert com o snapshot do produto e onConflict', async () => {
    const query = makeQuery({ error: null });
    from.mockReturnValue(query);
    const product = { id: 5, title: 'Mouse' };

    await setCartItem('user-1', product, 3);

    expect(query.upsert).toHaveBeenCalledWith(
      { user_id: 'user-1', product_id: 5, product, quantity: 3 },
      { onConflict: 'user_id,product_id' }
    );
  });
});

describe('removeCartItem', () => {
  it('filtra por usuário e produto', async () => {
    const query = makeQuery({ error: null });
    from.mockReturnValue(query);

    await removeCartItem('user-1', 5);

    expect(query.delete).toHaveBeenCalled();
    expect(query.eq).toHaveBeenCalledWith('user_id', 'user-1');
    expect(query.eq).toHaveBeenCalledWith('product_id', 5);
  });
});

describe('clearCart', () => {
  it('apaga todos os itens do usuário', async () => {
    const query = makeQuery({ error: null });
    from.mockReturnValue(query);

    await clearCart('user-1');

    expect(query.delete).toHaveBeenCalled();
    expect(query.eq).toHaveBeenCalledWith('user_id', 'user-1');
  });
});
