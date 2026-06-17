// src/screens/Detail.jsx — galeria com zoom, bloco de preço, CTAs, trust, reviews, relacionados
import { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Badge, StarRating } from '@/components/ds';
import { Icon as I } from '@/components/Icon.jsx';
import { useStore } from '@/context/StoreContext';
import { fmtBRL, finalPrice, galleryFor } from '@/lib/format';
import { Eyebrow, ProductGrid } from './shared.jsx';

const REVIEWS = [
  { n: 'Mariana Alves', d: '2 de junho de 2026', r: 5, t: 'Superou as expectativas. Chegou antes do prazo e a qualidade é impecável. Já é meu produto favorito.' },
  { n: 'Rafael Souza', d: '28 de maio de 2026', r: 4, t: 'Muito bom pelo preço. Recomendo — só achei a embalagem um pouco simples para um item desse nível.' },
  { n: 'Carla Mendes', d: '21 de maio de 2026', r: 5, t: 'Atendimento rápido e produto exatamente como descrito. Voltarei a comprar na TADS com certeza.' },
];
const RATING_BREAKDOWN = [
  { stars: 5, pct: 72 }, { stars: 4, pct: 19 }, { stars: 3, pct: 6 }, { stars: 2, pct: 2 }, { stars: 1, pct: 1 },
];

function Gallery({ images, discount }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(null);
  const ref = useRef(null);
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - r.top) / r.height) * 100));
    setZoom({ x, y });
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={() => setZoom(null)}
        style={{ position: 'relative', borderRadius: 'var(--radius-xl)', overflow: 'hidden', background: '#fff', boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-gray-100)', aspectRatio: '1', cursor: 'zoom-in' }}
      >
        <img src={images[active]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        {zoom && (
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${images[active]})`, backgroundRepeat: 'no-repeat', backgroundSize: '210%', backgroundPosition: `${zoom.x}% ${zoom.y}%` }} />
        )}
        {discount > 0 && (
          <div style={{ position: 'absolute', top: 16, left: 16 }}><Badge variant="deal">-{Math.round(discount)}%</Badge></div>
        )}
        <span style={{ position: 'absolute', bottom: 12, right: 12, display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.92)', color: 'var(--color-gray-600)', borderRadius: 'var(--radius-full)', padding: '6px 12px', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', pointerEvents: 'none', boxShadow: 'var(--shadow-sm)' }}>
          <I.ZoomIn size={14} /> Passe o mouse para ampliar
        </span>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        {images.map((src, i) => (
          <button key={i} onClick={() => setActive(i)}
            style={{ width: 72, height: 72, borderRadius: 'var(--radius-md)', overflow: 'hidden', padding: 0, cursor: 'pointer', flexShrink: 0, border: '2px solid ' + (active === i ? 'var(--color-primary-700)' : 'var(--color-gray-200)') }}>
            <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </button>
        ))}
      </div>
    </div>
  );
}

function ReviewsBlock({ rating }) {
  return (
    <section style={{ marginTop: 56, borderTop: '1px solid var(--color-gray-200)', paddingTop: 40 }}>
      <Eyebrow>Opiniões</Eyebrow>
      <h2 style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-gray-900)', margin: '6px 0 28px' }}>Avaliações de clientes</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 280px) 1fr', gap: 40, alignItems: 'start' }}>
        <div style={{ background: '#fff', border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 'var(--font-extrabold)', color: 'var(--color-gray-900)', lineHeight: 1 }}>{rating.toFixed(1)}</div>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0 6px' }}><StarRating rating={rating} size={18} /></div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>Baseado em 248 avaliações</p>
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {RATING_BREAKDOWN.map((b) => (
              <div key={b.stars} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', width: 28, display: 'flex', alignItems: 'center', gap: 2 }}>{b.stars}<I.Star size={11} filled style={{ color: '#f6ad55' }} /></span>
                <div style={{ flex: 1, height: 7, background: 'var(--color-gray-100)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{ width: b.pct + '%', height: '100%', background: '#f6ad55' }} />
                </div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)', width: 30, textAlign: 'right' }}>{b.pct}%</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {REVIEWS.map((rv, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-lg)', padding: 20, boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <span style={{ width: 40, height: 40, borderRadius: 'var(--radius-full)', background: 'var(--color-primary-700)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 'var(--font-bold)' }}>{rv.n.charAt(0)}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-900)' }}>{rv.n}</strong>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: '0.625rem', fontWeight: 'var(--font-bold)', color: 'var(--color-success)', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}><I.Check size={12} /> Verificada</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                    <StarRating rating={rv.r} size={13} />
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)' }}>{rv.d}</span>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)', lineHeight: 1.65 }}>{rv.t}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Detail() {
  const { nav, addToCart, toggleWish, wish, products } = useStore();
  const { id } = useParams();
  const pid = Number(id);
  const p = products.find((x) => x.id === pid) || products[0];
  const [qty, setQty] = useState(1);
  const fp = finalPrice(p);
  const images = galleryFor(p);
  const saved = p.discountPercentage > 0 ? p.price - fp : 0;
  const related = products.filter((x) => x.id !== p.id && x.category === p.category).slice(0, 4);
  const relatedFill = related.length ? related : products.filter((x) => x.id !== p.id).slice(0, 4);
  const trust = [
    { icon: <I.Truck size={20} />, h: 'Frete grátis', s: 'Acima de R$ 300' },
    { icon: <I.RotateCcw size={20} />, h: 'Troca fácil', s: '30 dias' },
    { icon: <I.Shield size={20} />, h: 'Compra segura', s: 'Mercado Pago' },
  ];

  return (
    <div className="container" style={{ padding: '24px 0 64px' }}>
      <button onClick={() => nav('catalog')} style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-gray-500)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--text-sm)', marginBottom: 20 }}>
        <I.ChevronLeft size={16} /> Voltar para a loja
      </button>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 48, alignItems: 'start' }}>
        <Gallery images={images} discount={p.discountPercentage} />

        <div>
          <Eyebrow>{p.category}</Eyebrow>
          <h1 style={{ fontSize: 'var(--text-4xl)', color: 'var(--color-gray-900)', margin: '8px 0 14px', lineHeight: 1.12 }}>{p.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
            <StarRating rating={p.rating} size={18} />
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>{p.rating} · 248 avaliações</span>
            <span style={{ fontSize: 'var(--text-sm)', color: p.stock < 10 ? 'var(--color-danger)' : 'var(--color-success)', fontWeight: 'var(--font-semibold)' }}>
              {p.stock < 10 ? `Últimas ${p.stock} unidades` : 'Em estoque'}
            </span>
          </div>

          {/* Bloco de preço */}
          <div style={{ background: 'var(--color-gray-50)', border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-lg)', padding: 20, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 'var(--font-extrabold)', color: 'var(--color-gray-900)', lineHeight: 1, letterSpacing: '-0.02em' }}>{fmtBRL(fp)}</span>
              {p.discountPercentage > 0 && <span style={{ fontSize: 'var(--text-lg)', color: 'var(--color-gray-400)', textDecoration: 'line-through' }}>{fmtBRL(p.price)}</span>}
              {p.discountPercentage > 0 && <Badge variant="deal">-{Math.round(p.discountPercentage)}%</Badge>}
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)', marginTop: 8 }}>
              {saved > 0 && <span style={{ color: 'var(--color-deal-text)', fontWeight: 'var(--font-bold)' }}>Você economiza {fmtBRL(saved)} · </span>}
              em até <strong style={{ color: 'var(--color-gray-800)' }}>12x de {fmtBRL(fp / 12)}</strong> sem juros
            </p>
          </div>

          <p style={{ color: 'var(--color-gray-600)', lineHeight: 1.7, marginBottom: 26 }}>{p.description}</p>

          {/* Qty + CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--color-gray-300)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ padding: 12, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gray-600)', display: 'flex' }}><I.Minus size={16} /></button>
              <span style={{ width: 44, textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 'var(--font-bold)' }}>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} style={{ padding: 12, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gray-600)', display: 'flex' }}><I.Plus size={16} /></button>
            </div>
            <Button variant="deal" size="lg" onClick={() => { addToCart(p, qty); nav('cart'); }} style={{ flex: 1 }}>Comprar agora</Button>
          </div>
          <Button variant="primary" size="lg" fullWidth onClick={() => addToCart(p, qty)} style={{ marginBottom: 10 }}><I.Cart size={18} /> Adicionar ao carrinho</Button>
          <button onClick={() => toggleWish(p.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '10px', background: 'none', border: 'none', cursor: 'pointer', color: wish[p.id] ? 'var(--color-danger)' : 'var(--color-gray-500)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>
            <I.Heart size={18} filled={wish[p.id]} /> {wish[p.id] ? 'Salvo nos favoritos' : 'Adicionar aos favoritos'}
          </button>

          {/* Trust row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 22 }}>
            {trust.map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px', background: '#fff', border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ color: 'var(--color-primary-700)', flexShrink: 0 }}>{t.icon}</span>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)', color: 'var(--color-gray-800)' }}>{t.h}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--color-gray-500)' }}>{t.s}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ReviewsBlock rating={p.rating} />

      <section style={{ marginTop: 56 }}>
        <h2 style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-gray-900)', marginBottom: 22 }}>Você também pode gostar</h2>
        <ProductGrid products={relatedFill} nav={nav} addToCart={addToCart} toggleWish={toggleWish} wish={wish} />
      </section>
    </div>
  );
}
