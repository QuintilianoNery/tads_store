// src/screens/Cart.jsx — itens com stepper de quantidade + resumo fixo
import { Button } from '@/components/ds';
import { Icon as I } from '@/components/Icon.jsx';
import { useStore } from '@/context/StoreContext';
import { fmtBRL, finalPrice } from '@/lib/format';

function Row({ label, value, big }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '6px 0' }}>
      <span style={{ color: big ? 'var(--color-gray-900)' : 'var(--color-gray-500)', fontSize: big ? 'var(--text-base)' : 'var(--text-sm)', fontWeight: big ? 'var(--font-semibold)' : 'var(--font-regular)' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--font-bold)', color: big ? 'var(--color-gray-900)' : 'var(--color-gray-800)', fontSize: big ? 'var(--text-2xl)' : 'var(--text-base)' }}>{value}</span>
    </div>
  );
}

export default function Cart() {
  const { nav, cart, setQty, removeItem } = useStore();
  const items = Object.values(cart);
  const subtotal = items.reduce((s, it) => s + finalPrice(it.product) * it.qty, 0);
  const frete = items.length ? (subtotal > 300 ? 0 : 29.9) : 0;

  if (!items.length) {
    return (
      <div className="container" style={{ padding: '64px 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-gray-900)', marginBottom: 12 }}>Seu carrinho está vazio</h1>
        <p style={{ color: 'var(--color-gray-500)', marginBottom: 24 }}>Que tal explorar nossos produtos em destaque?</p>
        <Button variant="primary" size="lg" onClick={() => nav('catalog')}>Ver produtos <I.ArrowRight size={18} /></Button>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 0 64px' }}>
      <h1 style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-gray-900)', marginBottom: 24 }}>Carrinho</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: 32, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map(({ product: p, qty }) => (
            <div key={p.id} style={{ display: 'flex', gap: 16, background: '#fff', border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-lg)', padding: 16, boxShadow: 'var(--shadow-sm)' }}>
              <img src={p.thumbnail} alt={p.title} style={{ width: 88, height: 88, objectFit: 'cover', borderRadius: 'var(--radius-md)', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'var(--font-bold)' }}>{p.category}</span>
                <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-gray-800)', margin: '2px 0 8px' }}>{p.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--color-gray-200)', borderRadius: 'var(--radius-md)' }}>
                    <button onClick={() => setQty(p.id, qty - 1)} style={{ padding: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gray-600)', display: 'flex' }}><I.Minus size={14} /></button>
                    <span style={{ width: 32, textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)' }}>{qty}</span>
                    <button onClick={() => setQty(p.id, qty + 1)} style={{ padding: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gray-600)', display: 'flex' }}><I.Plus size={14} /></button>
                  </div>
                  <button onClick={() => removeItem(p.id)} style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-gray-400)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--text-xs)' }}><I.Trash size={14} /> Remover</button>
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--font-bold)', color: 'var(--color-gray-900)', whiteSpace: 'nowrap' }}>{fmtBRL(finalPrice(p) * qty)}</div>
            </div>
          ))}
        </div>

        <aside style={{ background: '#fff', border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow-sm)', position: 'sticky', top: 24 }}>
          <h2 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-gray-900)', marginBottom: 16 }}>Resumo</h2>
          <Row label="Subtotal" value={fmtBRL(subtotal)} />
          <Row label="Frete" value={frete === 0 ? 'Grátis' : fmtBRL(frete)} />
          <div style={{ borderTop: '1px solid var(--color-gray-200)', margin: '12px 0' }} />
          <Row label="Total" value={fmtBRL(subtotal + frete)} big />
          <div style={{ marginTop: 20 }}>
            <Button variant="primary" size="lg" fullWidth onClick={() => nav('checkout')}>Finalizar compra <I.ArrowRight size={18} /></Button>
          </div>
          {frete > 0 && <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', marginTop: 12, textAlign: 'center' }}>Frete grátis em compras acima de R$ 300,00</p>}
        </aside>
      </div>
    </div>
  );
}
