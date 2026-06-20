// Testes das máscaras de formatação dos campos de cadastro.
import { describe, it, expect } from 'vitest';
import { maskCpfCnpj, maskPhone, maskCep, maskEmail } from '@/utils/masks';

describe('maskCpfCnpj', () => {
  it('formata CPF (até 11 dígitos)', () => {
    expect(maskCpfCnpj('12345678901')).toBe('123.456.789-01');
    expect(maskCpfCnpj('123456')).toBe('123.456');
  });

  it('formata CNPJ (acima de 11 dígitos)', () => {
    expect(maskCpfCnpj('12345678000199')).toBe('12.345.678/0001-99');
  });

  it('ignora caracteres não numéricos e limita o tamanho', () => {
    expect(maskCpfCnpj('123.456.789-01')).toBe('123.456.789-01');
    expect(maskCpfCnpj('1234567800019999')).toBe('12.345.678/0001-99');
  });
});

describe('maskPhone', () => {
  it('formata celular (11 dígitos)', () => {
    expect(maskPhone('11987654321')).toBe('(11) 98765-4321');
  });

  it('formata fixo (10 dígitos)', () => {
    expect(maskPhone('1133224455')).toBe('(11) 3322-4455');
  });

  it('é idempotente sobre valor já formatado', () => {
    expect(maskPhone('(11) 98765-4321')).toBe('(11) 98765-4321');
  });
});

describe('maskCep', () => {
  it('formata 00000-000', () => {
    expect(maskCep('01310100')).toBe('01310-100');
    expect(maskCep('013')).toBe('013');
  });
});

describe('maskEmail', () => {
  it('remove espaços e normaliza para minúsculas', () => {
    expect(maskEmail('  Maria@Email.COM ')).toBe('maria@email.com');
  });
});
