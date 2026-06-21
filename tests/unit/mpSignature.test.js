// Testes da verificação de assinatura (x-signature) do webhook do Mercado Pago.
import { describe, it, expect } from 'vitest';
import crypto from 'node:crypto';
import { parseSignature, verifyMercadoPagoSignature } from '../../api/_lib/mpSignature.js';

const secret = 'segredo_do_webhook';
const sign = (manifest) => crypto.createHmac('sha256', secret).update(manifest).digest('hex');

describe('parseSignature', () => {
  it('extrai ts e v1', () => {
    expect(parseSignature('ts=123,v1=abc')).toEqual({ ts: '123', v1: 'abc' });
  });
  it('tolera espaços ao redor', () => {
    expect(parseSignature(' ts=1 , v1=ff ')).toEqual({ ts: '1', v1: 'ff' });
  });
});

describe('verifyMercadoPagoSignature', () => {
  const dataId = '12345';
  const requestId = 'req-1';
  const ts = '1700000000';
  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;

  it('aceita assinatura correta', () => {
    const v1 = sign(manifest);
    expect(verifyMercadoPagoSignature({ signatureHeader: `ts=${ts},v1=${v1}`, requestId, dataId, secret })).toBe(true);
  });

  it('rejeita assinatura incorreta', () => {
    expect(verifyMercadoPagoSignature({ signatureHeader: `ts=${ts},v1=${'0'.repeat(64)}`, requestId, dataId, secret })).toBe(false);
  });

  it('rejeita sem secret', () => {
    expect(verifyMercadoPagoSignature({ signatureHeader: `ts=${ts},v1=abc`, requestId, dataId, secret: '' })).toBe(false);
  });

  it('rejeita header malformado', () => {
    expect(verifyMercadoPagoSignature({ signatureHeader: 'xxx', requestId, dataId, secret })).toBe(false);
  });

  it('faz lowercase do data.id no manifesto', () => {
    const v1 = sign(`id:abc;request-id:${requestId};ts:${ts};`);
    expect(verifyMercadoPagoSignature({ signatureHeader: `ts=${ts},v1=${v1}`, requestId, dataId: 'ABC', secret })).toBe(true);
  });
});
