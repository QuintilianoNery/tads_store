// Testes do serviço de endereços — foco no mapeamento camelCase <-> snake_case
// e na montagem das queries (mock do cliente Supabase).
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { makeQuery } from '../helpers/supabaseMock';

const { from } = vi.hoisted(() => ({ from: vi.fn() }));
vi.mock('@/services/supabase', () => ({ supabase: { from }, default: { from } }));

import {
  listAddresses, createAddress, updateAddress, deleteAddress, getAddresses,
} from '@/services/addressService';

beforeEach(() => { from.mockReset(); });

const dbRow = {
  id: 'a1', type: 'shipping', first_name: 'Maria', last_name: 'Silva', company: null,
  address: 'Rua X', number: '10', city: 'São Paulo', state: 'SP', zip_code: '01000-000',
  country: 'Brasil', phone: '11999',
};

describe('listAddresses', () => {
  it('converte linhas do banco (snake_case) para o formato da app (camelCase)', async () => {
    from.mockReturnValue(makeQuery({ data: [dbRow], error: null }));

    const [addr] = await listAddresses('user-1');

    expect(from).toHaveBeenCalledWith('addresses');
    expect(addr).toMatchObject({
      id: 'a1', firstName: 'Maria', lastName: 'Silva', cep: '01000-000',
      address: 'Rua X', number: '10', city: 'São Paulo', state: 'SP', phone: '11999',
    });
  });

  it('retorna lista vazia sem dados', async () => {
    from.mockReturnValue(makeQuery({ data: null, error: null }));
    expect(await listAddresses('user-1')).toEqual([]);
  });
});

describe('createAddress', () => {
  it('monta as colunas em snake_case e usa type "shipping" por padrão', async () => {
    const query = makeQuery({ data: dbRow, error: null });
    from.mockReturnValue(query);

    const saved = await createAddress('user-1', {
      firstName: 'Maria', lastName: 'Silva', phone: '11999', cep: '01000-000',
      address: 'Rua X', number: '10', city: 'São Paulo', state: 'SP', company: '',
    });

    expect(query.insert).toHaveBeenCalledWith(expect.objectContaining({
      user_id: 'user-1', type: 'shipping', first_name: 'Maria', last_name: 'Silva',
      zip_code: '01000-000', address: 'Rua X', number: '10', company: null,
    }));
    // o retorno volta no formato da app
    expect(saved).toMatchObject({ id: 'a1', firstName: 'Maria', cep: '01000-000' });
  });
});

describe('updateAddress', () => {
  it('atualiza pelo id e devolve o endereço mapeado', async () => {
    const query = makeQuery({ data: dbRow, error: null });
    from.mockReturnValue(query);

    const saved = await updateAddress('a1', 'user-1', { firstName: 'Maria', cep: '01000-000', type: 'shipping' });

    expect(query.update).toHaveBeenCalled();
    expect(query.eq).toHaveBeenCalledWith('id', 'a1');
    expect(saved).toMatchObject({ id: 'a1', firstName: 'Maria' });
  });
});

describe('deleteAddress', () => {
  it('remove pelo id', async () => {
    const query = makeQuery({ error: null });
    from.mockReturnValue(query);

    await deleteAddress('a1');

    expect(query.delete).toHaveBeenCalled();
    expect(query.eq).toHaveBeenCalledWith('id', 'a1');
  });
});

describe('getAddresses', () => {
  it('indexa por tipo (billing/shipping)', async () => {
    from.mockReturnValue(makeQuery({ data: [dbRow], error: null }));

    const result = await getAddresses('user-1');

    expect(result.shipping).toMatchObject({ id: 'a1', firstName: 'Maria' });
    expect(result.billing).toBeNull();
  });
});
