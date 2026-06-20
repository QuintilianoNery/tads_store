// Testes do helper de Checkout Pro (Mercado Pago) — mock de fetch e window.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createPreference } from '@/lib/mercadopago';

// Produtos de exemplo: um com desconto (finalPrice aplica) e um sem.
const camiseta = { id: 1, title: 'Camiseta', thumbnail: 't.jpg', category: 'roupas', price: 100, discountPercentage: 10 };
const caneca = { id: 2, title: 'Caneca', thumbnail: 'c.jpg', category: 'casa', price: 50 };
const cart = [{ product: camiseta, qty: 2 }, { product: caneca, qty: 1 }];

function stubWindow(hostname, origin) {
  vi.stubGlobal('window', { location: { hostname, origin } });
}
function okResponse(data) {
  return { ok: true, json: async () => data };
}
/** Corpo JSON enviado no fetch da chamada `call` (0 por padrão). */
function sentBody(call = 0) {
  return JSON.parse(fetch.mock.calls[call][1].body);
}

beforeEach(() => { vi.stubGlobal('fetch', vi.fn()); });
afterEach(() => { vi.unstubAllGlobals(); });

describe('createPreference', () => {
  it('mapeia o carrinho ({product, qty}) para itens do Mercado Pago usando finalPrice', async () => {
    stubWindow('localhost', 'http://localhost:3000');
    fetch.mockResolvedValue(okResponse({ id: 'pref_1', init_point: 'https://mp/checkout' }));

    await createPreference({ items: cart, externalReference: 777 });

    expect(fetch).toHaveBeenCalledWith('/api/create-preference', expect.objectContaining({ method: 'POST' }));
    const body = sentBody();
    expect(body.items).toEqual([
      { id: '1', title: 'Camiseta', description: 'roupas', picture_url: 't.jpg', category_id: 'roupas', quantity: 2, unit_price: 90, currency_id: 'BRL' },
      { id: '2', title: 'Caneca', description: 'casa', picture_url: 'c.jpg', category_id: 'casa', quantity: 1, unit_price: 50, currency_id: 'BRL' },
    ]);
    expect(body.external_reference).toBe('777');
  });

  it('devolve initPoint e preferenceId da resposta', async () => {
    stubWindow('localhost', 'http://localhost:3000');
    fetch.mockResolvedValue(okResponse({ id: 'pref_9', init_point: 'https://mp/go' }));

    const result = await createPreference({ items: cart, externalReference: 1 });

    expect(result).toEqual({ initPoint: 'https://mp/go', preferenceId: 'pref_9' });
  });

  it('omite back_urls em localhost (o Mercado Pago recusa domínio local)', async () => {
    stubWindow('localhost', 'http://localhost:3000');
    fetch.mockResolvedValue(okResponse({ id: 'p', init_point: 'https://mp' }));

    await createPreference({ items: cart, externalReference: 1 });

    expect(sentBody().back_urls).toBeUndefined();
  });

  it('inclui back_urls (mesma página) e frete em domínio https', async () => {
    stubWindow('loja.vercel.app', 'https://loja.vercel.app');
    fetch.mockResolvedValue(okResponse({ id: 'p', init_point: 'https://mp' }));

    await createPreference({ items: cart, externalReference: 1, shipmentCost: 29.9 });

    const body = sentBody();
    const retorno = 'https://loja.vercel.app/pedido-recebido';
    expect(body.back_urls).toEqual({ success: retorno, failure: retorno, pending: retorno });
    expect(body.shipments).toEqual({ cost: 29.9, mode: 'not_specified' });
  });

  it('não envia shipments quando o frete é zero (frete grátis)', async () => {
    stubWindow('loja.vercel.app', 'https://loja.vercel.app');
    fetch.mockResolvedValue(okResponse({ id: 'p', init_point: 'https://mp' }));

    await createPreference({ items: cart, externalReference: 1, shipmentCost: 0 });

    expect(sentBody().shipments).toBeUndefined();
  });

  it('lança erro quando o carrinho está vazio', async () => {
    stubWindow('localhost', 'http://localhost:3000');
    await expect(createPreference({ items: [], externalReference: 1 })).rejects.toThrow('Carrinho vazio');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('lança erro quando a resposta não é ok', async () => {
    stubWindow('localhost', 'http://localhost:3000');
    fetch.mockResolvedValue({ ok: false, status: 500, text: async () => 'boom' });

    await expect(createPreference({ items: cart, externalReference: 1 })).rejects.toThrow('HTTP 500');
  });
});
