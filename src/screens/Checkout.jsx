// src/screens/Checkout.jsx — checkout em etapas: Entrega → Pagamento → Confirmação.
// Rota protegida: o usuário está sempre logado. O endereço de entrega é
// escolhido na agenda de endereços (AddressBook). O pagamento é processado pelo
// Mercado Pago (Checkout Pro): ao confirmar, criamos a preference no servidor e
// redirecionamos o comprador. O pedido é registrado no retorno (/pedido-recebido).
import React, { useState } from 'react';
import { Button } from '@/components/ds';
import { Icon } from '@/components/Icon.jsx';
import { AddressBook } from '@/components/AddressBook.jsx';
import { useStore } from '@/context/StoreContext';
import { createPreference } from '@/lib/mercadopago';
import { setOrderPreference } from '@/services/orderService';
import { fmtBRL, finalPrice } from '@/lib/format';
import { useIsTablet } from '@/hooks/useMediaQuery';

const STEPS = ['Entrega', 'Pagamento', 'Confirmação'];

// Id do pedido pendente, guardado antes de abrir o Mercado Pago. A tela de
// retorno (/pedido-recebido) usa para acompanhar a confirmação do pagamento.
const PENDING_ORDER_ID_KEY = 'tads-pending-order-id';

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
  const { nav, cart, user, createPendingOrder } = useStore();
  const items = Object.values(cart || {});
  const isTablet = useIsTablet();

  const [step, setStep] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [deliveryError, setDeliveryError] = useState('');

  const [redirecting, setRedirecting] = useState(false);
  const [payError, setPayError] = useState('');

  const subtotal = items.reduce((total, item) => total + finalPrice(item.product) * item.qty, 0);
  const shippingCost = items.length ? (subtotal > 300 ? 0 : 29.9) : 0;
  const orderTotal = subtotal + shippingCost;

  // Avança para o pagamento exigindo um endereço de entrega selecionado.
  function handleContinueDelivery() {
    if (!selectedAddress) { setDeliveryError('Selecione ou cadastre um endereço de entrega.'); return; }
    setDeliveryError('');
    setStep(1); window.scrollTo(0, 0);
  }

  function goTo(n) { setStep(n); window.scrollTo(0, 0); }

  // Cria o pedido (pendente) + a preference e redireciona ao Checkout Pro na
  // MESMA aba. Ao terminar, o Mercado Pago volta para /pedido-recebido (com o
  // status e o external_reference), que confirma o pedido. O webhook (servidor)
  // segue como reforço, caso o cliente feche a aba antes de voltar.
  async function handlePay() {
    setPayError('');
    setRedirecting(true);
    try {
      const order = await createPendingOrder({ subtotal, total: orderTotal, address: selectedAddress });
      const payer = {
        name: selectedAddress?.firstName,
        surname: selectedAddress?.lastName,
        email: user?.email || undefined,
      };
      const { initPoint, preferenceId } = await createPreference({
        items, payer, externalReference: order.id, shipmentCost: shippingCost,
      });
      if (preferenceId) {
        setOrderPreference(order.id, preferenceId).catch((err) => console.error('Falha ao vincular preference:', err));
      }
      // Guarda o id como fallback (o MP também devolve em external_reference).
      sessionStorage.setItem(PENDING_ORDER_ID_KEY, order.id);
      window.location.href = initPoint; // mesma aba → Checkout Pro → volta para /pedido-recebido
    } catch (err) {
      console.error('Falha ao iniciar pagamento:', err);
      sessionStorage.removeItem(PENDING_ORDER_ID_KEY);
      setPayError('Não foi possível iniciar o pagamento. Tente novamente.');
      setRedirecting(false);
    }
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

      <div style={{ display: 'grid', gridTemplateColumns: isTablet ? '1fr' : 'minmax(0, 1fr) 360px', gap: 28, alignItems: 'start' }}>
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
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: 16, borderRadius: 'var(--radius-md)', border: '2px solid var(--color-primary-700)', background: 'var(--color-primary-50)' }}>
                <span style={{ color: 'var(--color-primary-700)', flexShrink: 0, marginTop: 2 }}><Icon.Lock size={22} /></span>
                <div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: 'var(--color-gray-900)' }}>Mercado Pago</div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)', marginTop: 4 }}>
                    Você será redirecionado para o ambiente seguro do Mercado Pago para concluir o pagamento com <strong>cartão de crédito, Pix ou boleto</strong>. Nenhum dado de cartão é digitado ou armazenado nesta loja.
                  </p>
                </div>
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
                  <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: 'var(--color-gray-700)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>Pagamento</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-800)' }}>Mercado Pago — cartão, Pix ou boleto</p>
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
              {payError && (
                <div role="alert" aria-live="assertive" style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fee2e2', color: '#b91c1c', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', marginTop: 18 }}>
                  <Icon.AlertCircle size={18} /> <span>{payError}</span>
                </div>
              )}
              <div style={{ display: 'flex', gap: 12, marginTop: 22 }}>
                <Button variant="ghost" size="lg" disabled={redirecting} onClick={() => goTo(1)}><Icon.ChevronLeft size={18} /> Voltar</Button>
                <Button variant="deal" size="lg" fullWidth disabled={redirecting} onClick={handlePay}><Icon.Lock size={18} /> {redirecting ? 'Redirecionando...' : 'Pagar com Mercado Pago'}</Button>
              </div>
            </Panel>
          )}
        </div>

        {/* direita: resumo do pedido (sempre visível) */}
        <aside style={{ position: isTablet ? 'static' : 'sticky', top: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
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
