// Testes dos validadores de formulário (login, cadastro, troca de senha,
// checkout/endereço). Lógica pura, sem dependências.
import { describe, it, expect } from 'vitest';
import { isValidEmail, isNotEmpty, isValidPassword, MIN_PASSWORD_LENGTH } from '@/utils/validators';

describe('isValidEmail', () => {
  it('aceita e-mails bem formados (com trim)', () => {
    expect(isValidEmail('maria@email.com')).toBe(true);
    expect(isValidEmail('  joao@dominio.com.br  ')).toBe(true);
  });

  it('rejeita e-mails inválidos', () => {
    expect(isValidEmail('invalido')).toBe(false);
    expect(isValidEmail('a@b')).toBe(false);
    expect(isValidEmail('sem@dominio')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });
});

describe('isNotEmpty', () => {
  it('verdadeiro para texto com conteúdo', () => {
    expect(isNotEmpty('abc')).toBe(true);
    expect(isNotEmpty('  x  ')).toBe(true);
  });

  it('falso para vazio, só espaços, null ou undefined', () => {
    expect(isNotEmpty('')).toBe(false);
    expect(isNotEmpty('   ')).toBe(false);
    expect(isNotEmpty(null)).toBe(false);
    expect(isNotEmpty(undefined)).toBe(false);
  });
});

describe('isValidPassword', () => {
  it('exige o comprimento mínimo', () => {
    expect(isValidPassword('a'.repeat(MIN_PASSWORD_LENGTH))).toBe(true);
    expect(isValidPassword('a'.repeat(MIN_PASSWORD_LENGTH + 4))).toBe(true);
  });

  it('rejeita senhas curtas ou vazias', () => {
    expect(isValidPassword('a'.repeat(MIN_PASSWORD_LENGTH - 1))).toBe(false);
    expect(isValidPassword('')).toBe(false);
    expect(isValidPassword(null)).toBe(false);
  });
});
