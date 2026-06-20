// Testes do serviço de pedidos (mock do cliente Supabase). O formatador puro
// orderNumber é testado separadamente em orderNumber.test.js.
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { makeQuery } from '../helpers/supabaseMock';

const { from } = vi.hoisted(() => ({ from: vi.fn() }));
vi.mock('@/services/supabase', () => ({ supabase: { from }, default: { from } }));

import { createOrder, getOrders, getStockConsumption } from '@/services/orderService';

beforeEach(() => { from.mockReset(); });

describe('createOrder', () => {
  it('grava o pedido e seus itens, calculando os preços', async () => {
    const orderQuery = makeQuery({ data: { id: 'oid', total: 200 }, error: null });
    const itemsQuery = makeQuery({ data: [{ id: 'it1' }], error: null });
    from.mockReturnValueOnce(orderQuery).mockReturnValueOnce(itemsQuery);

    const items = [{ product: { id: 1, title: 'A', thumbnail: 't', price: 100, discountPercentage: 0 }, qty: 2 }];
    const result = await createOrder({
      userId: 'user-1', items, subtotal: 200, total: 200, paymentMethod: 'pix', address: { city: 'SP' },
    });

    expect(orderQuery.insert).toHaveBeenCalledWith(expect.objectContaining({
      user_id: 'user-1', status: 'pago', subtotal: 200, total: 200, payment_method: 'pix', billing_address: { city: 'SP' },
    }));
    expect(itemsQuery.insert).toHaveBeenCalledWith([
      expect.objectContaining({ order_id: 'oid', product_id: 1, product_title: 'A', quantity: 2, unit_price: 100, total_price: 200 }),
    ]);
    expect(result).toMatchObject({ id: 'oid', order_items: [{ id: 'it1' }] });
  });

  it('propaga erro ao gravar o pedido', async () => {
    from.mockReturnValueOnce(makeQuery({ data: null, error: new Error('boom') }));
    await expect(createOrder({ userId: 'u', items: [], subtotal: 0, total: 0, paymentMethod: 'card' }))
      .rejects.toThrow('boom');
  });
});

describe('getStockConsumption', () => {
  it('soma as quantidades compradas por produto', async () => {
    from.mockReturnValue(makeQuery({
      data: [
        { product_id: 1, quantity: 2 },
        { product_id: 1, quantity: 3 },
        { product_id: 2, quantity: 1 },
      ],
      error: null,
    }));

    expect(await getStockConsumption('user-1')).toEqual({ 1: 5, 2: 1 });
  });

  it('retorna objeto vazio sem pedidos', async () => {
    from.mockReturnValue(makeQuery({ data: [], error: null }));
    expect(await getStockConsumption('user-1')).toEqual({});
  });
});

describe('getOrders', () => {
  it('retorna os pedidos com seus itens', async () => {
    const orders = [{ id: 'o1', order_items: [{ id: 'it1' }] }];
    from.mockReturnValue(makeQuery({ data: orders, error: null }));

    expect(await getOrders('user-1')).toEqual(orders);
    expect(from).toHaveBeenCalledWith('orders');
  });
});
