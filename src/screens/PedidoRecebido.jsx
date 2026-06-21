// src/screens/PedidoRecebido.jsx — retorno do Checkout Pro (Mercado Pago).
// Esta aba acompanha o pedido (criado como 'pendente' no checkout) por polling
// até ele ser confirmado. A confirmação canônica vem do **webhook** (servidor,
// api/mp-webhook.js) — por isso funciona mesmo que a aba de pagamento seja
// fechada. O status do MP na query (?status=) é só uma dica de UX.
//
// O id do pedido vem em ?order= (nova aba) ou do sessionStorage (fallback de
// mesma aba, quando o pop-up é bloqueado).
//
// Em DEV (localhost) o webhook não é alcançável pelo MP; então, se a URL trouxer
// status=approved, confirmamos o pedido no cliente apenas para testar o fluxo.
// Em produção isso fica desligado (a autoridade é o webhook).
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, Spinner } from '@/components/ds';
import { Icon } from '@/components/Icon.jsx';
import { useStore } from '@/context/StoreContext';
import { getOrderById, markOrderPaid } from '@/services/orderService';
import { orderNumber } from '@/lib/orderNumber';
import { fmtBRL } from '@/lib/format';

const PENDING_ORDER_ID_KEY = 'tads-pending-order-id';
const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 3 * 60 * 1000;

function Hero({ color, icon, title, subtitle }) {
  return (
    <>
      <div style={{ width: 80, height: 80, borderRadius: 'var(--radius-full)', background: color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px', boxShadow: 'var(--shadow-lg)', animation: 'fadeIn 0.4s ease' }}>
        {icon}
      </div>
      <h1 style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-gray-900)', marginBottom: 10 }}>{title}</h1>
      <p style={{ color: 'var(--color-gray-500)', marginBottom: 24 }}>{subtitle}</p>
    </>
  );
}

function OrderCard({ order, footer }) {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow-sm)', textAlign: 'left', marginBottom: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid var(--color-gray-100)' }}>
        <span style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>Número do pedido</span>
        <strong style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gray-900)' }}>{orderNumber(order)}</strong>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: footer ? 8 : 0 }}>
        <span style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>Total</span>
        <strong style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gray-900)' }}>{fmtBRL(order.total)}</strong>
      </div>
      {footer}
    </div>
  );
}

function Wrapper({ children }) {
  return <div className="container" style={{ padding: '64px 0', maxWidth: 560, textAlign: 'center' }}>{children}</div>;
}

export default function PedidoRecebido() {
  const { nav, clearCart, reloadStock, authInitializing } = useStore();
  const [params] = useSearchParams();
  const orderId = params.get('order') || (typeof window !== 'undefined' && sessionStorage.getItem(PENDING_ORDER_ID_KEY)) || null;
  const mpStatus = params.get('status') || params.get('collection_status');

  const [view, setView] = useState('waiting'); // waiting | success | pending | failure | error
  const [order, setOrder] = useState(null);
  const doneRef = useRef(false);

  useEffect(() => {
    if (authInitializing) return undefined;

    const isFailureHint = mpStatus === 'failure' || mpStatus === 'rejected' || mpStatus === 'cancelled';

    if (!orderId) {
      setView(isFailureHint ? 'failure' : 'error');
      return undefined;
    }

    let active = true;
    let timer;
    const startedAt = Date.now();

    const finish = (nextView, paidOrder) => {
      if (doneRef.current) return;
      doneRef.current = true;
      sessionStorage.removeItem(PENDING_ORDER_ID_KEY);
      if (nextView === 'success') {
        setOrder(paidOrder);
        clearCart();
        reloadStock();
      }
      setView(nextView);
    };

    const poll = async () => {
      if (!active) return;
      try {
        let current = await getOrderById(orderId);

        // Fallback de DEV (localhost): o MP não alcança o webhook, então, se a
        // URL trouxe status=approved, confirmamos o pedido no cliente p/ testar.
        if (import.meta.env.DEV && mpStatus === 'approved' && current.status === 'pendente') {
          const paid = await markOrderPaid(orderId);
          if (paid) current = paid;
        }

        if (!active) return;

        if (current.status === 'pago') { finish('success', current); return; }
        if (current.status === 'cancelado') { finish('failure', null); return; }

        // Ainda pendente
        if (isFailureHint) { finish('failure', null); return; }
        if (Date.now() - startedAt > POLL_TIMEOUT_MS) { setView('pending'); return; }
        setView('waiting');
        timer = setTimeout(poll, POLL_INTERVAL_MS);
      } catch (err) {
        console.error('Falha ao consultar o pedido:', err);
        if (active) setView('error');
      }
    };

    poll();
    return () => { active = false; clearTimeout(timer); };
  }, [authInitializing, orderId, mpStatus, clearCart, reloadStock]);

  if (view === 'waiting') {
    return (
      <Wrapper>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}><Spinner size={40} /></div>
        <h1 style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-gray-900)' }}>Aguardando confirmação do pagamento…</h1>
        <p style={{ color: 'var(--color-gray-500)', marginTop: 8, marginBottom: 24 }}>
          Pode levar alguns segundos. Você pode deixar esta aba aberta — assim que o pagamento for confirmado, o pedido aparece aqui e em Meus Pedidos.
        </p>
        <Button variant="secondary" size="lg" onClick={() => nav('account')}>Ver meus pedidos</Button>
      </Wrapper>
    );
  }

  if (view === 'success') {
    return (
      <Wrapper>
        <Hero color="var(--color-success)" icon={<Icon.Check size={42} />} title="Pagamento aprovado!"
          subtitle="Obrigado pela compra. Você pode acompanhar o pedido a qualquer momento em Meus Pedidos." />
        {order && (
          <OrderCard order={order} footer={(
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-success)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginTop: 8 }}>
              <Icon.Truck size={16} /> Entrega estimada: 3 dias úteis
            </div>
          )} />
        )}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Button variant="secondary" size="lg" onClick={() => nav('account')}>Ver meus pedidos</Button>
          <Button variant="primary" size="lg" onClick={() => nav('catalog')}>Voltar para a loja</Button>
        </div>
      </Wrapper>
    );
  }

  if (view === 'pending') {
    return (
      <Wrapper>
        <Hero color="var(--color-deal-text)" icon={<Icon.AlertCircle size={42} />} title="Pagamento em processamento"
          subtitle="Seu pedido foi registrado e ainda aguarda a confirmação do pagamento (comum em Pix/boleto). Acompanhe o status em Meus Pedidos — atualizamos assim que for confirmado." />
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Button variant="secondary" size="lg" onClick={() => nav('catalog')}>Voltar para a loja</Button>
          <Button variant="primary" size="lg" onClick={() => nav('account')}>Ver meus pedidos</Button>
        </div>
      </Wrapper>
    );
  }

  if (view === 'error') {
    return (
      <Wrapper>
        <Hero color="var(--color-danger, #b91c1c)" icon={<Icon.AlertCircle size={42} />} title="Não encontramos seu pedido"
          subtitle="Não foi possível acompanhar este pagamento. Se você concluiu a compra, ela aparecerá em Meus Pedidos assim que for confirmada." />
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Button variant="secondary" size="lg" onClick={() => nav('catalog')}>Voltar para a loja</Button>
          <Button variant="primary" size="lg" onClick={() => nav('account')}>Ver meus pedidos</Button>
        </div>
      </Wrapper>
    );
  }

  // failure
  return (
    <Wrapper>
      <Hero color="var(--color-danger, #b91c1c)" icon={<Icon.AlertCircle size={42} />} title="Pagamento não concluído"
        subtitle="O pagamento não foi aprovado ou foi cancelado. Nenhum valor foi cobrado e seu carrinho continua salvo — é só tentar de novo." />
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <Button variant="secondary" size="lg" onClick={() => nav('catalog')}>Voltar para a loja</Button>
        <Button variant="primary" size="lg" onClick={() => nav('checkout')}>Tentar novamente</Button>
      </div>
    </Wrapper>
  );
}
