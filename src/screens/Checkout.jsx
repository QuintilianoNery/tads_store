// src/screens/Checkout.jsx — checkout em etapas: Entrega → Pagamento → Confirmação.
// Rota protegida: o usuário está sempre logado. O endereço de entrega é
// escolhido na agenda de endereços (AddressBook), que permite selecionar,
// editar ou adicionar endereços vinculados ao cadastro.
import React, { useState } from 'react';
import { Button, Input } from '@/components/ds';
import { Icon } from '@/components/Icon.jsx';
import { AddressBook } from '@/components/AddressBook.jsx';
import { useStore } from '@/context/StoreContext';
import { orderNumber } from '@/services/orderService';
import { fmtBRL, finalPrice } from '@/lib/format';

const STEPS = ['Entrega', 'Pagamento', 'Confirmação'];
const PAYMENT_LABELS = { card: 'Cartão de crédito', pix: 'Pix', boleto: 'Boleto bancário' };

function Stepper({ step }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
      {STEPS.map((stepLabel, i) => {
        const isComplete = i < step, isActive = i === step;
        return (
          <React.Fragment key={stepLabel}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 26, height: 26, borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)', fontFamily: 'var(--font-display)',
                background: isComplete || isActive ? 'var(--color-primary-700)' : 'var(--color-gray-200)', color: isComplete || isActive ? '#fff' : 'var(--color-gray-500)' }}>
                {isComplete ? '✓' : i + 1}
              </span>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: isActive ? 'var(--font-bold)' : 'var(--font-medium)', color: isActive ? 'var(--color-gray-900)' : 'var(--color-gray-500)' }}>{stepLabel}</span>
            </div>
            {i < STEPS.length - 1 && <span style={{ width: 28, height: 2, background: i < step ? 'var(--color-primary-700)' : 'var(--color-gray-200)' }} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function FieldRow({ children, cols }) {
  return <div style={{ display: 'grid', gridTemplateColumns: cols || '1fr', gap: 14 }}>{children}</div>;
}

function PayOption({ id, icon, title, subtitle, selected, onSelect }) {
  return (
    <button type="button" onClick={() => onSelect(id)}
      style={{ display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', width: '100%', padding: '14px 16px', cursor: 'pointer', borderRadius: 'var(--radius-md)',
        border: '2px solid ' + (selected ? 'var(--color-primary-700)' : 'var(--color-gray-200)'),
        background: selected ? 'var(--color-primary-50)' : '#fff', transition: 'all var(--transition-fast)' }}>
      <span style={{ color: selected ? 'var(--color-primary-700)' : 'var(--color-gray-500)' }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: 'var(--color-gray-900)' }}>{title}</div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>{subtitle}</div>
      </div>
      <span style={{ width: 18, height: 18, borderRadius: 'var(--radius-full)', border: '2px solid ' + (selected ? 'var(--color-primary-700)' : 'var(--color-gray-300)'), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {selected && <span style={{ width: 8, height: 8, borderRadius: 'var(--radius-full)', background: 'var(--color-primary-700)' }} />}
      </span>
    </button>
  );
}

function Panel({ title, children }) {
  return (
    <section style={{ background: '#fff', border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow-sm)' }}>
      <h2 style={{ fontSize: 'var(--text-lg)', color: 'var(--color-gray-900)', marginBottom: 18 }}>{title}</h2>
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

function formatAddress(a) {
  if (!a) return '';
  const linha1 = [a.address, a.number].filter(Boolean).join(', ');
  const linha2 = [a.city, a.state].filter(Boolean).join(' — ');
  return [linha1, [linha2, a.cep].filter(Boolean).join(' · ')].filter(Boolean).join('\n');
}

export default function Checkout() {
  const { nav, cart, placeOrder, user } = useStore();
  const items = Object.values(cart || {});

  const [step, setStep] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [deliveryError, setDeliveryError] = useState('');

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [finalizeError, setFinalizeError] = useState('');
  // Pedido concluído (vindo do Supabase) — guarda o snapshot para a tela de
  // sucesso, já que o carrinho é esvaziado ao finalizar.
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const subtotal = items.reduce((total, item) => total + finalPrice(item.product) * item.qty, 0);
  const shippingCost = items.length ? (subtotal > 300 ? 0 : 29.9) : 0;
  const pixDiscount = paymentMethod === 'pix' ? +(subtotal * 0.05).toFixed(2) : 0;
  const orderTotal = subtotal + shippingCost - pixDiscount;

  // Avança para o pagamento exigindo um endereço de entrega selecionado.
  function handleContinueDelivery() {
    if (!selectedAddress) { setDeliveryError('Selecione ou cadastre um endereço de entrega.'); return; }
    setDeliveryError('');
    setStep(1); window.scrollTo(0, 0);
  }

  function goTo(n) { setStep(n); window.scrollTo(0, 0); }

  // Registra o pedido (Supabase + atualização de estoque) e mostra a confirmação.
  async function handleFinalize() {
    setFinalizeError('');
    setPlacingOrder(true);
    try {
      const order = await placeOrder({ subtotal, total: orderTotal, paymentMethod, address: selectedAddress });
      setConfirmedOrder(order);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error('Falha ao finalizar pedido:', err);
      setFinalizeError('Não foi possível concluir o pedido. Tente novamente.');
    } finally {
      setPlacingOrder(false);
    }
  }

  // ── Pedido confirmado ──────────────────────────────────────
  if (confirmedOrder) {
    return (
      <div className="container" style={{ padding: '64px 0', maxWidth: 560, textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: 'var(--radius-full)', background: 'var(--color-success)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px', boxShadow: 'var(--shadow-lg)', animation: 'fadeIn 0.4s ease' }}>
          <Icon.Check size={42} />
        </div>
        <h1 style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-gray-900)', marginBottom: 10 }}>Pedido confirmado!</h1>
        <p style={{ color: 'var(--color-gray-500)', marginBottom: 24 }}>Obrigado pela compra. Enviamos a confirmação por e-mail e você pode acompanhar o rastreio a qualquer momento.</p>
        <div style={{ background: '#fff', border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow-sm)', textAlign: 'left', marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid var(--color-gray-100)' }}>
            <span style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>Número do pedido</span>
            <strong style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gray-900)' }}>{orderNumber(confirmedOrder)}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>Total pago</span>
            <strong style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gray-900)' }}>{fmtBRL(confirmedOrder.total)}</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-success)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>
            <Icon.Truck size={16} /> Entrega estimada: 3 dias úteis
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Button variant="secondary" size="lg" onClick={() => nav('account')}>Ver meus pedidos</Button>
          <Button variant="primary" size="lg" onClick={() => nav('catalog')}>Voltar para a loja</Button>
        </div>
      </div>
    );
  }

  // ── Carrinho vazio ─────────────────────────────────────────
  if (!items.length) {
    return (
      <div className="container" style={{ padding: '64px 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-gray-900)', marginBottom: 12 }}>Nada para finalizar</h1>
        <p style={{ color: 'var(--color-gray-500)', marginBottom: 24 }}>Seu carrinho está vazio. Adicione produtos antes do checkout.</p>
        <Button variant="primary" size="lg" onClick={() => nav('catalog')}>Ver produtos <Icon.ArrowRight size={18} /></Button>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '36px 0 64px' }}>
      <button onClick={() => nav('cart')} style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-gray-500)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--text-sm)', marginBottom: 16 }}>
        <Icon.ChevronLeft size={16} /> Voltar ao carrinho
      </button>
      <h1 style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-gray-900)', marginBottom: 20 }}>Finalizar compra</h1>
      <Stepper step={step} />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: 28, alignItems: 'start' }}>
        {/* esquerda: etapa atual */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* ── ETAPA 0: ENTREGA ── */}
          {step === 0 && (
            <Panel title="Endereço de entrega">
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', marginBottom: 16 }}>
                Selecione o endereço para a entrega ou cadastre um novo.
              </p>
              <AddressBook
                userId={user?.id}
                selectable
                selectedId={selectedAddress?.id ?? null}
                onSelect={(addr) => { setSelectedAddress(addr); if (addr) setDeliveryError(''); }}
              />
              {deliveryError && (
                <div role="alert" aria-live="assertive" style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fee2e2', color: '#b91c1c', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', marginTop: 16 }}>
                  <Icon.AlertCircle size={18} /> <span>{deliveryError}</span>
                </div>
              )}
              <div style={{ marginTop: 20 }}>
                <Button variant="primary" size="lg" fullWidth disabled={!selectedAddress} onClick={handleContinueDelivery}>
                  Continuar para pagamento <Icon.ArrowRight size={18} />
                </Button>
              </div>
            </Panel>
          )}

          {/* ── ETAPA 1: PAGAMENTO ── */}
          {step === 1 && (
            <Panel title="Forma de pagamento">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <PayOption id="card" icon={<Icon.CreditCard size={22} />} title="Cartão de crédito" subtitle="Em até 12x sem juros" selected={paymentMethod === 'card'} onSelect={setPaymentMethod} />
                <PayOption id="pix" icon={<Icon.Zap size={22} />} title="Pix" subtitle="5% de desconto · aprovação imediata" selected={paymentMethod === 'pix'} onSelect={setPaymentMethod} />
                <PayOption id="boleto" icon={<Icon.Tag size={22} />} title="Boleto bancário" subtitle="Vence em 3 dias úteis" selected={paymentMethod === 'boleto'} onSelect={setPaymentMethod} />
              </div>
              {paymentMethod === 'card' && (
                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <Input label="Número do cartão" placeholder="0000 0000 0000 0000" />
                  <FieldRow cols="1fr 1fr 1fr">
                    <Input label="Validade" placeholder="MM/AA" />
                    <Input label="CVV" placeholder="000" />
                    <Input label="Parcelas" placeholder="12x" />
                  </FieldRow>
                </div>
              )}
              {paymentMethod === 'pix' && (
                <p style={{ marginTop: 14, fontSize: 'var(--text-sm)', color: 'var(--color-deal-text)', background: 'var(--color-deal-soft)', border: '1px solid #fde68a', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
                  Você ganha <strong>5% de desconto</strong> pagando com Pix. O código será gerado na confirmação.
                </p>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>
                <Icon.Lock size={14} /> Pagamento processado com segurança via <strong style={{ color: 'var(--color-gray-700)' }}>Mercado Pago</strong>.
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <Button variant="ghost" size="lg" onClick={() => goTo(0)}><Icon.ChevronLeft size={18} /> Voltar</Button>
                <Button variant="primary" size="lg" fullWidth onClick={() => goTo(2)}>Revisar pedido <Icon.ArrowRight size={18} /></Button>
              </div>
            </Panel>
          )}

          {/* ── ETAPA 2: CONFIRMAÇÃO ── */}
          {step === 2 && (
            <Panel title="Revise e confirme">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: 'var(--color-gray-700)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Entrega</h3>
                    <button type="button" onClick={() => goTo(0)} style={{ color: 'var(--color-accent)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)' }}>Editar</button>
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-800)' }}>{selectedAddress?.firstName} {selectedAddress?.lastName} · {selectedAddress?.phone}</p>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)', whiteSpace: 'pre-line' }}>{formatAddress(selectedAddress)}</p>
                </div>
                <div style={{ borderTop: '1px solid var(--color-gray-100)' }} />
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: 'var(--color-gray-700)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Pagamento</h3>
                    <button type="button" onClick={() => goTo(1)} style={{ color: 'var(--color-accent)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)' }}>Editar</button>
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-800)' }}>{PAYMENT_LABELS[paymentMethod]}</p>
                </div>
                <div style={{ borderTop: '1px solid var(--color-gray-100)' }} />
                <div>
                  <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: 'var(--color-gray-700)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>Itens ({items.length})</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {items.map(({ product, qty }) => (
                      <div key={product.id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <img src={product.thumbnail} alt="" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 'var(--radius-md)', flexShrink: 0 }} />
                        <span style={{ flex: 1, fontSize: 'var(--text-sm)', color: 'var(--color-gray-800)' }}>{product.title} <span style={{ color: 'var(--color-gray-400)' }}>× {qty}</span></span>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--font-bold)', fontSize: 'var(--text-sm)' }}>{fmtBRL(finalPrice(product) * qty)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {finalizeError && (
                <div role="alert" aria-live="assertive" style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fee2e2', color: '#b91c1c', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', marginTop: 18 }}>
                  <Icon.AlertCircle size={18} /> <span>{finalizeError}</span>
                </div>
              )}
              <div style={{ display: 'flex', gap: 12, marginTop: 22 }}>
                <Button variant="ghost" size="lg" disabled={placingOrder} onClick={() => goTo(1)}><Icon.ChevronLeft size={18} /> Voltar</Button>
                <Button variant="deal" size="lg" fullWidth disabled={placingOrder} onClick={handleFinalize}><Icon.Lock size={18} /> {placingOrder ? 'Processando...' : 'Finalizar compra'}</Button>
              </div>
            </Panel>
          )}
        </div>

        {/* direita: resumo do pedido (sempre visível) */}
        <aside style={{ position: 'sticky', top: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: '#fff', border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-lg)', padding: 22, boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: 'var(--text-lg)', color: 'var(--color-gray-900)', marginBottom: 16 }}>Resumo do pedido</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16, maxHeight: 220, overflowY: 'auto' }}>
              {items.map(({ product, qty }) => (
                <div key={product.id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img src={product.thumbnail} alt="" style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                    <span style={{ position: 'absolute', top: -6, right: -6, minWidth: 18, height: 18, padding: '0 5px', borderRadius: 'var(--radius-full)', background: 'var(--color-primary-700)', color: '#fff', fontSize: '0.625rem', fontWeight: 'var(--font-bold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{qty}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--color-gray-800)', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.title}</p>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>{fmtBRL(finalPrice(product))}</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: 'var(--color-gray-900)', whiteSpace: 'nowrap' }}>{fmtBRL(finalPrice(product) * qty)}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid var(--color-gray-100)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <SumRow label="Subtotal" value={fmtBRL(subtotal)} />
              <SumRow label="Frete" value={shippingCost === 0 ? 'Grátis' : fmtBRL(shippingCost)} highlight={shippingCost === 0} />
              {pixDiscount > 0 && <SumRow label="Desconto Pix (5%)" value={'- ' + fmtBRL(pixDiscount)} highlight />}
              <div style={{ borderTop: '1px solid var(--color-gray-200)', margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)', color: 'var(--color-gray-900)' }}>Total</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)', color: 'var(--color-gray-900)' }}>{fmtBRL(orderTotal)}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'var(--color-primary-50)', borderRadius: 'var(--radius-md)', color: 'var(--color-primary-800)', fontSize: 'var(--text-xs)' }}>
            <Icon.Shield size={18} /> Compra 100% protegida. Seus dados são criptografados.
          </div>
        </aside>
      </div>
    </div>
  );
}
