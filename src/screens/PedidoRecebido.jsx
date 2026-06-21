// src/screens/PedidoRecebido.jsx — retorno do Checkout Pro (Mercado Pago).
// O Mercado Pago redireciona para cá anexando o `status` do pagamento na query
// (approved / pending / rejected...). Em approved/pending registramos o pedido
// a partir do snapshot guardado no checkout; em rejected/failure não registramos
// e mantemos o carrinho para o cliente tentar de novo.
//
// Observação (escopo de estudo): a confirmação definitiva do pagamento seria
// feita por webhook (etapa 4 do Mercado Pago), fora do escopo aqui. Por isso
// confiamos no `status` da URL de retorno.
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, Spinner } from '@/components/ds';
import { Icon } from '@/components/Icon.jsx';
import { useStore } from '@/context/StoreContext';
import { orderNumber } from '@/lib/orderNumber';
import { fmtBRL } from '@/lib/format';

const PENDING_ORDER_KEY = 'tads-pending-order';

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

export default function PedidoRecebido() {
  const { nav, placeOrder, authInitializing } = useStore();
  const [params] = useSearchParams();
  const status = params.get('status') || params.get('collection_status');

  const [view, setView] = useState('processing'); // processing | success | pending | failure | error
  const [order, setOrder] = useState(null);
  const processedRef = useRef(false);

  useEffect(() => {
    if (authInitializing) return;        // espera a sessão ser restaurada após o redirect
    if (processedRef.current) return;

    const isApproved = status === 'approved';
    const isPending = status === 'pending' || status === 'in_process';
    const raw = sessionStorage.getItem(PENDING_ORDER_KEY);

    // Recusado/cancelado, ou retorno sem status conhecido: não registra o pedido.
    if (!isApproved && !isPending) {
      processedRef.current = true;
      sessionStorage.removeItem(PENDING_ORDER_KEY);
      setView('failure');
      return;
    }

    // Sem snapshot: refresh da página ou acesso direto — já foi processado.
    if (!raw) {
      processedRef.current = true;
      setView(isPending ? 'pending' : 'success');
      return;
    }

    // Consome o snapshot de forma síncrona para evitar registro duplicado
    // (StrictMode reexecuta o efeito; refresh da página repete a chamada).
    processedRef.current = true;
    sessionStorage.removeItem(PENDING_ORDER_KEY);
    const snap = JSON.parse(raw);

    (async () => {
      try {
        const placed = await placeOrder({
          subtotal: snap.subtotal,
          total: snap.total,
          paymentMethod: 'mercadopago',
          address: snap.address,
          items: snap.items,
        });
        setOrder(placed);
        setView(isPending ? 'pending' : 'success');
      } catch (err) {
        console.error('Falha ao registrar o pedido no retorno do Mercado Pago:', err);
        setView('error');
      }
    })();
  }, [authInitializing, status, placeOrder]);

  const Wrapper = ({ children }) => (
    <div className="container" style={{ padding: '64px 0', maxWidth: 560, textAlign: 'center' }}>{children}</div>
  );

  if (view === 'processing') {
    return (
      <Wrapper>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}><Spinner size={40} /></div>
        <h1 style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-gray-900)' }}>Confirmando seu pagamento…</h1>
        <p style={{ color: 'var(--color-gray-500)', marginTop: 8 }}>Aguarde um instante, estamos registrando seu pedido.</p>
      </Wrapper>
    );
  }

  if (view === 'success') {
    return (
      <Wrapper>
        <Hero color="var(--color-success)" icon={<Icon.Check size={42} />} title="Pagamento aprovado!"
          subtitle="Obrigado pela compra. Enviamos a confirmação por e-mail e você pode acompanhar o pedido a qualquer momento." />
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
        <Hero color="var(--color-deal-text)" icon={<Icon.AlertCircle size={42} />} title="Pagamento pendente"
          subtitle="Seu pedido foi registrado e está aguardando a confirmação do pagamento (Pix ou boleto). Assim que for aprovado, ele segue para separação." />
        {order && <OrderCard order={order} />}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Button variant="secondary" size="lg" onClick={() => nav('account')}>Ver meus pedidos</Button>
          <Button variant="primary" size="lg" onClick={() => nav('catalog')}>Voltar para a loja</Button>
        </div>
      </Wrapper>
    );
  }

  if (view === 'error') {
    return (
      <Wrapper>
        <Hero color="var(--color-danger, #b91c1c)" icon={<Icon.AlertCircle size={42} />} title="Quase lá…"
          subtitle="Seu pagamento foi processado, mas tivemos um problema ao registrar o pedido. Guarde o comprovante do Mercado Pago e fale com o suporte para regularizarmos." />
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Button variant="secondary" size="lg" onClick={() => nav('help')}>Falar com o suporte</Button>
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
