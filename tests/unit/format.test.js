// Testes de formatação de preço usados em carrinho e checkout.
import { describe, it, expect } from 'vitest';
import { finalPrice, fmtBRL } from '@/lib/format';

describe('finalPrice', () => {
  it('aplica o desconto percentual', () => {
    expect(finalPrice({ price: 100, discountPercentage: 20 })).toBe(80);
  });

  it('arredonda para 2 casas decimais', () => {
    expect(finalPrice({ price: 199.9, discountPercentage: 15 })).toBe(169.91);
  });

  it('retorna o preço cheio quando não há desconto', () => {
    expect(finalPrice({ price: 50, discountPercentage: 0 })).toBe(50);
    expect(finalPrice({ price: 50 })).toBe(50);
  });
});

describe('fmtBRL', () => {
  it('formata o valor em reais (pt-BR)', () => {
    expect(fmtBRL(1234.5)).toMatch(/1\.234,50/);
  });

  it('trata valores ausentes como zero', () => {
    expect(fmtBRL(undefined)).toMatch(/0,00/);
    expect(fmtBRL(null)).toMatch(/0,00/);
  });
});
