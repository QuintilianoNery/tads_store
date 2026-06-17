// src/screens/Checkout.jsx — checkout visual (stepper, formulário, pagamento, resumo, sucesso)
// Mercado Pago aparece apenas como apresentação — sem integração real.
import React, { useState, useMemo } from 'react';
import { Button, Input } from '@/components/ds';
import { Icon as I } from '@/components/Icon.jsx';
import { useStore } from '@/context/StoreContext';
import { fmtBRL, finalPrice } from '@/lib/format';

function Stepper({ step }) {
  const steps = ['Entrega', 'Pagamento', 'Confirmação'];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
      {steps.map((s, i) => {
        const done = i < step, active = i === step;
        return (
          <React.Fragment key={s}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 26, height: 26, borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)', fontFamily: 'var(--font-display)',
                background: done || active ? 'var(--color-primary-700)' : 'var(--color-gray-200)', color: done || active ? '#fff' : 'var(--color-gray-500)' }}>
                {done ? '✓' : i + 1}
              </span>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: active ? 'var(--font-bold)' : 'var(--font-medium)', color: active ? 'var(--color-gray-900)' : 'var(--color-gray-500)' }}>{s}</span>
            </div>
            {i < steps.length - 1 && <span style={{ width: 28, height: 2, background: 'var(--color-gray-200)' }} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function FieldRow({ children, cols }) {
  return <div style={{ display: 'grid', gridTemplateColumns: cols || '1fr', gap: 14 }}>{children}</div>;
}

function PayOption({ id, icon, title, sub, selected, onSelect }) {
  return (
    <button type="button" onClick={() => onSelect(id)}
      style={{ display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', width: '100%', padding: '14px 16px', cursor: 'pointer', borderRadius: 'var(--radius-md)',
        border: '2px solid ' + (selected ? 'var(--color-primary-700)' : 'var(--color-gray-200)'),
        background: selected ? 'var(--color-primary-50)' : '#fff', transition: 'all var(--transition-fast)' }}>
      <span style={{ color: selected ? 'var(--color-primary-700)' : 'var(--color-gray-500)' }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: 'var(--color-gray-900)' }}>{title}</div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>{sub}</div>
      </div>
      <span style={{ width: 18, height: 18, borderRadius: 'var(--radius-full)', border: '2px solid ' + (selected ? 'var(--color-primary-700)' : 'var(--color-gray-300)'), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {selected && <span style={{ width: 8, height: 8, borderRadius: 'var(--radius-full)', background: 'var(--color-primary-700)' }} />}
      </span>
    </button>
  );
}

function Panel({ n, title, children }) {
  return (
    <section style={{ background: '#fff', border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow-sm)' }}>
      <h2 style={{ fontSize: 'var(--text-lg)', color: 'var(--color-gray-900)', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 24, height: 24, borderRadius: 'var(--radius-full)', background: 'var(--color-gray-900)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-display)' }}>{n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function SumRow({ label, value, highlight }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
      <span style={{ color: 'var(--color-gray-500)' }}>{label}</span>
      <span style={{ fontWeight: 'var(--font-semibold)', color: highlight ? 'var(--color-success)' : 'var(--color-gray-800)' }}>{value}</span>
    </div>
  );
}

export default function Checkout() {
  const { nav, cart, clearCart } = useStore();
  const items = Object.values(cart || {});
  const [pay, setPay] = useState('card');
  const [done, setDone] = useState(false);
  const subtotal = items.reduce((s, it) => s + finalPrice(it.product) * it.qty, 0);
  const frete = items.length ? (subtotal > 300 ? 0 : 29.9) : 0;
  const desconto = pay === 'pix' ? +(subtotal * 0.05).toFixed(2) : 0;
  const total = subtotal + frete - desconto;
  const orderNo = useMemo(() => 'TADS-' + Math.floor(100000 + Math.random() * 899999), []);

  if (done) {
    return (
      <div className="container" style={{ padding: '64px 0', maxWidth: 560, textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: 'var(--radius-full)', background: 'var(--color-success)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px', boxShadow: 'var(--shadow-lg)', animation: 'fadeIn 0.4s ease' }}>
          <I.Check size={42} />
        </div>
        <h1 style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-gray-900)', marginBottom: 10 }}>Pedido confirmado!</h1>
        <p style={{ color: 'var(--color-gray-500)', marginBottom: 24 }}>Obrigado pela compra. Enviamos a confirmação por e-mail e você pode acompanhar o rastreio a qualquer momento.</p>
        <div style={{ background: '#fff', border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow-sm)', textAlign: 'left', marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid var(--color-gray-100)' }}>
            <span style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>Número do pedido</span>
            <strong style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gray-900)' }}>{orderNo}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>Total pago</span>
            <strong style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gray-900)' }}>{fmtBRL(total)}</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-success)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>
            <I.Truck size={16} /> Entrega estimada: 3 dias úteis
          </div>
        </div>
        <Button variant="primary" size="lg" onClick={() => { clearCart && clearCart(); nav('home'); }}>Voltar para a loja</Button>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="container" style={{ padding: '64px 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-gray-900)', marginBottom: 12 }}>Nada para finalizar</h1>
        <p style={{ color: 'var(--color-gray-500)', marginBottom: 24 }}>Seu carrinho está vazio. Adicione produtos antes do checkout.</p>
        <Button variant="primary" size="lg" onClick={() => nav('catalog')}>Ver produtos <I.ArrowRight size={18} /></Button>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '36px 0 64px' }}>
      <button onClick={() => nav('cart')} style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-gray-500)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--text-sm)', marginBottom: 16 }}>
        <I.ChevronLeft size={16} /> Voltar ao carrinho
      </button>
      <h1 style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-gray-900)', marginBottom: 20 }}>Finalizar compra</h1>
      <Stepper step={1} />

      <form onSubmit={(e) => { e.preventDefault(); setDone(true); window.scrollTo(0, 0); }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: 28, alignItems: 'start' }}>
          {/* esquerda: formulários */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Panel n="1" title="Dados e entrega">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <FieldRow cols="1fr 1fr">
                  <Input label="Nome completo" placeholder="Seu nome" required />
                  <Input label="E-mail" type="email" placeholder="seu@email.com" required />
                </FieldRow>
                <FieldRow cols="1fr 1fr">
                  <Input label="CPF" placeholder="000.000.000-00" required />
                  <Input label="Telefone" placeholder="(11) 90000-0000" required />
                </FieldRow>
                <FieldRow cols="1fr 2fr">
                  <Input label="CEP" placeholder="00000-000" required />
                  <Input label="Endereço" placeholder="Rua, número, complemento" required />
                </FieldRow>
                <FieldRow cols="2fr 1fr">
                  <Input label="Cidade" placeholder="Cidade" required />
                  <Input label="UF" placeholder="SP" required />
                </FieldRow>
              </div>
            </Panel>

            <Panel n="2" title="Forma de pagamento">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <PayOption id="card" icon={<I.CreditCard size={22} />} title="Cartão de crédito" sub="Em até 12x sem juros" selected={pay === 'card'} onSelect={setPay} />
                <PayOption id="pix" icon={<I.Zap size={22} />} title="Pix" sub="5% de desconto · aprovação imediata" selected={pay === 'pix'} onSelect={setPay} />
                <PayOption id="boleto" icon={<I.Tag size={22} />} title="Boleto bancário" sub="Vence em 3 dias úteis" selected={pay === 'boleto'} onSelect={setPay} />
              </div>
              {pay === 'card' && (
                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <Input label="Número do cartão" placeholder="0000 0000 0000 0000" />
                  <FieldRow cols="1fr 1fr 1fr">
                    <Input label="Validade" placeholder="MM/AA" />
                    <Input label="CVV" placeholder="000" />
                    <Input label="Parcelas" placeholder="12x" />
                  </FieldRow>
                </div>
              )}
              {pay === 'pix' && (
                <p style={{ marginTop: 14, fontSize: 'var(--text-sm)', color: 'var(--color-deal-text)', background: 'var(--color-deal-soft)', border: '1px solid #fde68a', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
                  Você ganha <strong>5% de desconto</strong> pagando com Pix. O código será gerado na confirmação.
                </p>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>
                <I.Lock size={14} /> Pagamento processado com segurança via <strong style={{ color: 'var(--color-gray-700)' }}>Mercado Pago</strong>.
              </div>
            </Panel>
          </div>

          {/* direita: resumo do pedido */}
          <aside style={{ position: 'sticky', top: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: '#fff', border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-lg)', padding: 22, boxShadow: 'var(--shadow-sm)' }}>
              <h2 style={{ fontSize: 'var(--text-lg)', color: 'var(--color-gray-900)', marginBottom: 16 }}>Resumo do pedido</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16, maxHeight: 220, overflowY: 'auto' }}>
                {items.map(({ product: p, qty }) => (
                  <div key={p.id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <img src={p.thumbnail} alt="" style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                      <span style={{ position: 'absolute', top: -6, right: -6, minWidth: 18, height: 18, padding: '0 5px', borderRadius: 'var(--radius-full)', background: 'var(--color-primary-700)', color: '#fff', fontSize: '0.625rem', fontWeight: 'var(--font-bold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{qty}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--color-gray-800)', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</p>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>{fmtBRL(finalPrice(p))}</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: 'var(--color-gray-900)', whiteSpace: 'nowrap' }}>{fmtBRL(finalPrice(p) * qty)}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid var(--color-gray-100)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <SumRow label="Subtotal" value={fmtBRL(subtotal)} />
                <SumRow label="Frete" value={frete === 0 ? 'Grátis' : fmtBRL(frete)} highlight={frete === 0} />
                {desconto > 0 && <SumRow label="Desconto Pix (5%)" value={'- ' + fmtBRL(desconto)} highlight />}
                <div style={{ borderTop: '1px solid var(--color-gray-200)', margin: '8px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)', color: 'var(--color-gray-900)' }}>Total</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)', color: 'var(--color-gray-900)' }}>{fmtBRL(total)}</span>
                </div>
              </div>
              <div style={{ marginTop: 18 }}>
                <Button type="submit" variant="deal" size="lg" fullWidth><I.Lock size={18} /> Pagar com segurança</Button>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'var(--color-primary-50)', borderRadius: 'var(--radius-md)', color: 'var(--color-primary-800)', fontSize: 'var(--text-xs)' }}>
              <I.Shield size={18} /> Compra 100% protegida. Seus dados são criptografados.
            </div>
          </aside>
        </div>
      </form>
    </div>
  );
}
