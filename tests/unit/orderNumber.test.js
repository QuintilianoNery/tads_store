// Testes do número de pedido legível exibido no checkout e no histórico.
import { describe, it, expect } from 'vitest';
import { orderNumber } from '@/lib/orderNumber';

describe('orderNumber', () => {
  it('deriva um código TADS dos 6 primeiros hex do uuid (maiúsculo)', () => {
    expect(orderNumber({ id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })).toBe('TADS-A1B2C3');
  });

  it('ignora os hífens do uuid', () => {
    expect(orderNumber({ id: 'ab-cd-ef-12-34' })).toBe('TADS-ABCDEF');
  });

  it('não quebra com pedido nulo ou sem id', () => {
    expect(orderNumber(null)).toBe('TADS-');
    expect(orderNumber({})).toBe('TADS-');
  });
});
