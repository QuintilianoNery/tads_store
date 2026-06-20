// src/screens/Home.jsx — herói, trust strip, categorias, ofertas do dia, destaques
import { useState, useEffect } from 'react';
import { Button } from '@/components/ds';
import { Icon } from '@/components/Icon.jsx';
import { useStore } from '@/context/StoreContext';
import { categoryLabel } from '@/utils/formatters';
import { Eyebrow, ProductGrid } from './shared.jsx';

const categoryImage = (products, category) =>
  (products.find((product) => product.category === category) || {}).thumbnail;

// Tempo restante até o fim do dia (23:59:59) no formato HH:MM:SS.
function timeUntilEndOfDay() {
  const now = new Date();
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);
  const totalSeconds = Math.max(0, Math.floor((endOfDay - now) / 1000));
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(Math.floor(totalSeconds / 3600))}:${pad(Math.floor((totalSeconds % 3600) / 60))}:${pad(totalSeconds % 60)}`;
}

// Contador regressivo das "promoções relâmpago". Cosmético: reinicia sozinho a
// cada virada de dia, pois recalcula sempre a partir do horário atual.
function FlashSaleCountdown() {
  const [remaining, setRemaining] = useState(timeUntilEndOfDay);
  useEffect(() => {
    const id = setInterval(() => setRemaining(timeUntilEndOfDay()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #fde68a', borderRadius: 'var(--radius-full)', padding: '8px 14px', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: 'var(--color-deal-text)' }}>
      Termina em <span style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '0.04em' }}>{remaining}</span>
    </span>
  );
}

export default function Home() {
  const { nav, addToCart, toggleWish, wish, products, categories } = useStore();
  const featuredProducts = products.slice(0, 8);
  const discountedProducts = products.filter((product) => product.discountPercentage > 0).slice(0, 4);
  const highlightedCategories = categories.filter((category) => category !== 'Todos').slice(0, 4);
  const benefits = [
    { icon: <Icon.Truck size={26} />, title: 'Entrega rápida', description: 'Receba em até 3 dias úteis' },
    { icon: <Icon.Shield size={26} />, title: 'Compra segura', description: 'Seus dados sempre protegidos' },
    { icon: <Icon.RotateCcw size={26} />, title: 'Troca fácil', description: '30 dias para devolver' },
    { icon: <Icon.Zap size={26} />, title: 'Melhores preços', description: 'Ofertas todos os dias' },
  ];

  return (
    <div>
      {/* Herói */}
      <section style={{ background: 'var(--gradient-brand)', padding: '72px 0', overflow: 'hidden' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 56, alignItems: 'center' }}>
          <div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: 'var(--color-deal)', color: 'var(--color-gray-900)', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>
              <Icon.Tag size={14} /> Semana de ofertas · até 30% OFF
            </span>
            <h1 style={{ fontSize: 'var(--text-5xl)', fontWeight: 'var(--font-extrabold)', color: '#fff', lineHeight: 1.08, letterSpacing: '-0.02em', marginBottom: 20 }}>
              O marketplace que<span style={{ color: 'var(--color-primary-300)' }}> você merecia.</span>
            </h1>
            <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-primary-200)', lineHeight: 1.6, marginBottom: 28, maxWidth: '34rem' }}>
              Milhares de produtos com entrega rápida, pagamento seguro e os melhores preços do Brasil. Tudo em um só lugar.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Button variant="deal" size="lg" onClick={() => nav('catalog')}>Ver ofertas <Icon.ArrowRight size={18} /></Button>
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
          {benefits.map((benefit, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ width: 46, height: 46, borderRadius: 'var(--radius-md)', background: 'var(--color-primary-50)', color: 'var(--color-primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{benefit.icon}</span>
              <div>
                <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: 'var(--color-gray-900)' }}>{benefit.title}</h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>{benefit.description}</p>
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
            {highlightedCategories.map((category) => (
              <button key={category} onClick={() => nav('catalog', category)}
                style={{ position: 'relative', height: 150, borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-gray-100)', cursor: 'pointer', padding: 0, boxShadow: 'var(--shadow-sm)' }}>
                <img src={categoryImage(products, category)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.78) 0%, rgba(15,23,42,0.12) 60%, transparent 100%)' }} />
                <span style={{ position: 'absolute', left: 16, bottom: 14, color: '#fff', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {categoryLabel(category)} <Icon.ArrowRight size={16} />
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
                  <Icon.Zap size={26} style={{ color: 'var(--color-deal-strong)' }} /> Promoções relâmpago
                </h2>
              </div>
              <FlashSaleCountdown />
            </div>
            <ProductGrid products={discountedProducts} nav={nav} addToCart={addToCart} toggleWish={toggleWish} wish={wish} />
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
            <button onClick={() => nav('catalog')} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: 'var(--color-accent)', background: 'none', border: 'none', cursor: 'pointer' }}>Ver todos <Icon.ArrowRight size={16} /></button>
          </div>
          <ProductGrid products={featuredProducts} nav={nav} addToCart={addToCart} toggleWish={toggleWish} wish={wish} />
        </div>
      </section>
    </div>
  );
}
