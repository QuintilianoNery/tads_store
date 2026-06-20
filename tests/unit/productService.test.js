// Testes do serviço de produtos (DummyJSON) — mock do fetch global.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { updateProductStock, getProductById } from '@/services/productService';

beforeEach(() => { vi.stubGlobal('fetch', vi.fn()); });
afterEach(() => { vi.unstubAllGlobals(); });

describe('updateProductStock', () => {
  it('faz PUT com o novo estoque e devolve o produto', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => ({ id: 5, stock: 3 }) });

    const result = await updateProductStock(5, 3);

    expect(fetch).toHaveBeenCalledWith(
      'https://dummyjson.com/products/5',
      expect.objectContaining({ method: 'PUT', body: JSON.stringify({ stock: 3 }) })
    );
    expect(result).toEqual({ id: 5, stock: 3 });
  });

  it('lança erro em resposta não-ok', async () => {
    fetch.mockResolvedValue({ ok: false, status: 500, statusText: 'Server Error', json: async () => ({}) });
    await expect(updateProductStock(5, 3)).rejects.toThrow('Erro 500');
  });
});

describe('getProductById', () => {
  it('busca o produto pelo id', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => ({ id: 9, title: 'X' }) });

    const result = await getProductById(9);

    expect(fetch).toHaveBeenCalledWith('https://dummyjson.com/products/9');
    expect(result).toEqual({ id: 9, title: 'X' });
  });
});
