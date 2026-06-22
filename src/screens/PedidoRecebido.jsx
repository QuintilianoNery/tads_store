// src/screens/PedidoRecebido.jsx — retorno do Checkout Pro (Mercado Pago).
// O Mercado Pago redireciona para cá (mesma aba) com o resultado na query:
//   ?status=approved&external_reference=<id_do_pedido>&payment_id=...
// Confirmamos o pedido no retorno:
//   - approved  → marca o pedido como 'pago' e mostra o sucesso;
//   - pending   → mantém 'pendente' (Pix/boleto) e orienta;
//   - rejected/failure → mostra falha (carrinho preservado).
//
// O webhook (api/mp-webhook.js) também confirma no servidor — é o reforço para
// quando o cliente fecha a aba antes de voltar. `markOrderPaid` é idempotente
// (só pendente → pago), então não há conflito entre os dois caminhos.
//
// Observação (escopo de estudo): a confirmação no cliente confia no `status` da
// URL de retorno. Em uma loja real, a fonte de verdade deve ser o webhook
// (assinado). Aqui mantemos os dois para o fluxo ser confiável na demonstração.
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, Spinner } from '@/components/ds';
import { Icon } from '@/components/Icon.jsx';
import { useStore } from '@/context/StoreContext';
import { getOrderById, markOrderPaid } from '@/services/orderService';
import { orderNumber } from '@/lib/orderNumber';
import { fmtBRL } from '@/lib/format';

const PENDING_ORDER_ID_KEY = 'tads-pending-order-id';

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
  if (!order) return null;
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
  return <div className="container" style={{ padding: '64px var(--container-padding)', maxWidth: 560, textAlign: 'center' }}>{children}</div>;
}

export default function PedidoRecebido() {
  const { nav, clearCart, reloadStock, authInitializing } = useStore();
  const [params] = useSearchParams();
  // O Mercado Pago devolve o id do pedido em external_reference; mantemos ?order=
  // e o sessionStorage como fallback (ex.: mesma aba sem o parâmetro).
  const orderId = params.get('external_reference') || params.get('order')
    || (typeof window !== 'undefined' && sessionStorage.getItem(PENDING_ORDER_ID_KEY)) || null;
  const status = params.get('status') || params.get('collection_status');

  const [view, setView] = useState('processing'); // processing | success | pending | failure | error
  const [order, setOrder] = useState(null);
  const doneRef = useRef(false);

  useEffect(() => {
    if (authInitializing) return;
    if (doneRef.current) return;
    doneRef.current = true;

    const isApproved = status === 'approved' || status === 'success';
    const isPending = status === 'pending' || status === 'in_process';

    if (!orderId) {
      setView(isApproved ? 'success' : isPending ? 'pending' : 'failure');
      return;
    }

    (async () => {
      try {
        // Falha/recusa: não confirma, mantém o carrinho.
        if (!isApproved && !isPending) {
          sessionStorage.removeItem(PENDING_ORDER_ID_KEY);
          setView('failure');
          return;
        }

        let current = await getOrderById(orderId);

        if (isApproved) {
          if (current.status === 'pendente') {
            await markOrderPaid(orderId).catch((e) => console.error('markOrderPaid:', e));
            current = await getOrderById(orderId);
          }
          setOrder(current);
          clearCart();
          reloadStock();
          sessionStorage.removeItem(PENDING_ORDER_ID_KEY);
          setView('success');
        } else {
          // pendente (Pix/boleto): aguarda a confirmação real (webhook).
          setOrder(current);
          setView('pending');
        }
      } catch (err) {
        console.error('Falha ao processar o retorno do pagamento:', err);
        setView('error');
      }
    })();
  }, [authInitializing, orderId, status, clearCart, reloadStock]);

  if (view === 'processing') {
    return (
      <Wrapper>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}><Spinner size={40} /></div>
        <h1 style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-gray-900)' }}>Confirmando seu pagamento…</h1>
        <p style={{ color: 'var(--color-gray-500)', marginTop: 8 }}>Só um instante.</p>
      </Wrapper>
    );
  }

  if (view === 'success') {
    return (
      <Wrapper>
        <Hero color="var(--color-success)" icon={<Icon.Check size={42} />} title="Pagamento aprovado!"
          subtitle="Obrigado pela compra. Você pode acompanhar o pedido a qualquer momento em Meus Pedidos." />
        <OrderCard order={order} footer={(
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-success)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginTop: 8 }}>
            <Icon.Truck size={16} /> Entrega estimada: 3 dias úteis
          </div>
        )} />
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
        <Hero color="var(--color-deal-text)" icon={<Icon.AlertCircle size={42} />} title="Pagamento pendente"
          subtitle="Seu pedido foi registrado e aguarda a confirmação do pagamento (comum em Pix/boleto). Atualizamos automaticamente assim que for confirmado — acompanhe em Meus Pedidos." />
        <OrderCard order={order} />
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
        <Hero color="var(--color-danger, #b91c1c)" icon={<Icon.AlertCircle size={42} />} title="Não foi possível confirmar"
          subtitle="Tivemos um problema ao confirmar este pagamento. Se o valor foi debitado, o pedido aparecerá em Meus Pedidos assim que for processado." />
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
