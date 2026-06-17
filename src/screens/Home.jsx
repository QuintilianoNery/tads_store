// src/screens/Home.jsx — herói, trust strip, categorias, ofertas do dia, destaques
import { Button } from '@/components/ds';
import { Icon as I } from '@/components/Icon.jsx';
import { useStore } from '@/context/StoreContext';
import { categoryLabel } from '@/utils/formatters';
import { Eyebrow, ProductGrid } from './shared.jsx';

const catImage = (products, cat) => (products.find((p) => p.category === cat) || {}).thumbnail;

export default function Home() {
  const { nav, addToCart, toggleWish, wish, products, categories } = useStore();
  const featured = products.slice(0, 8);
  const deals = products.filter((p) => p.discountPercentage > 0).slice(0, 4);
  const cats = categories.filter((c) => c !== 'Todos').slice(0, 4);
  const feats = [
    { icon: <I.Truck size={26} />, h: 'Entrega rápida', p: 'Receba em até 3 dias úteis' },
    { icon: <I.Shield size={26} />, h: 'Compra segura', p: 'Seus dados sempre protegidos' },
    { icon: <I.RotateCcw size={26} />, h: 'Troca fácil', p: '30 dias para devolver' },
    { icon: <I.Zap size={26} />, h: 'Melhores preços', p: 'Ofertas todos os dias' },
  ];

  return (
    <div>
      {/* Herói */}
      <section style={{ background: 'var(--gradient-brand)', padding: '72px 0', overflow: 'hidden' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 56, alignItems: 'center' }}>
          <div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: 'var(--color-deal)', color: 'var(--color-gray-900)', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>
              <I.Tag size={14} /> Semana de ofertas · até 30% OFF
            </span>
            <h1 style={{ fontSize: 'var(--text-5xl)', fontWeight: 'var(--font-extrabold)', color: '#fff', lineHeight: 1.08, letterSpacing: '-0.02em', marginBottom: 20 }}>
              O marketplace que<span style={{ color: 'var(--color-primary-300)' }}> você merecia.</span>
            </h1>
            <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-primary-200)', lineHeight: 1.6, marginBottom: 28, maxWidth: '34rem' }}>
              Milhares de produtos com entrega rápida, pagamento seguro e os melhores preços do Brasil. Tudo em um só lugar.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Button variant="deal" size="lg" onClick={() => nav('catalog')}>Ver ofertas <I.ArrowRight size={18} /></Button>
              <Button variant="secondary" size="lg" onClick={() => nav('catalog')} style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)' }}>Explorar catálogo</Button>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 48, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 'var(--radius-xl)', backdropFilter: 'blur(10px)' }}>
              <img src="/images/tads_store_logo.png" alt="" style={{ width: '9rem', height: 'auto', filter: 'brightness(0) invert(1) opacity(0.95)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Trust features */}
      <section style={{ background: '#fff', borderBottom: '1px solid var(--color-gray-100)', padding: '20px 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
          {feats.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ width: 46, height: 46, borderRadius: 'var(--radius-md)', background: 'var(--color-primary-50)', color: 'var(--color-primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{f.icon}</span>
              <div>
                <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: 'var(--color-gray-900)' }}>{f.h}</h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>{f.p}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categorias */}
      <section style={{ padding: '56px 0 8px' }}>
        <div className="container">
          <div style={{ marginBottom: 24 }}>
            <Eyebrow>Navegue</Eyebrow>
            <h2 style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-gray-900)', marginTop: 6 }}>Comprar por categoria</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {cats.map((c) => (
              <button key={c} onClick={() => nav('catalog', c)}
                style={{ position: 'relative', height: 150, borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-gray-100)', cursor: 'pointer', padding: 0, boxShadow: 'var(--shadow-sm)' }}>
                <img src={catImage(products, c)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.78) 0%, rgba(15,23,42,0.12) 60%, transparent 100%)' }} />
                <span style={{ position: 'absolute', left: 16, bottom: 14, color: '#fff', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {categoryLabel(c)} <I.ArrowRight size={16} />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Ofertas do dia */}
      <section style={{ padding: '48px 0' }}>
        <div className="container">
          <div style={{ background: 'var(--color-deal-soft)', border: '1px solid #fde68a', borderRadius: 'var(--radius-xl)', padding: '28px 28px 32px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 22 }}>
              <div>
                <Eyebrow color="var(--color-deal-text)">Ofertas do dia</Eyebrow>
                <h2 style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-gray-900)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <I.Zap size={26} style={{ color: 'var(--color-deal-strong)' }} /> Promoções relâmpago
                </h2>
              </div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #fde68a', borderRadius: 'var(--radius-full)', padding: '8px 14px', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: 'var(--color-deal-text)' }}>
                Termina em 05:42:18
              </span>
            </div>
            <ProductGrid products={deals} nav={nav} addToCart={addToCart} toggleWish={toggleWish} wish={wish} />
          </div>
        </div>
      </section>

      {/* Destaques */}
      <section style={{ padding: '8px 0 64px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <Eyebrow>Seleção TADS</Eyebrow>
              <h2 style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-gray-900)', marginTop: 6 }}>Produtos em destaque</h2>
            </div>
            <button onClick={() => nav('catalog')} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: 'var(--color-accent)', background: 'none', border: 'none', cursor: 'pointer' }}>Ver todos <I.ArrowRight size={16} /></button>
          </div>
          <ProductGrid products={featured} nav={nav} addToCart={addToCart} toggleWish={toggleWish} wish={wish} />
        </div>
      </section>
    </div>
  );
}
