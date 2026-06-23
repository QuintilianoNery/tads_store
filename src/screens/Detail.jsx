// src/screens/Detail.jsx — galeria com zoom, bloco de preço, CTAs, trust, reviews, relacionados
import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Badge, StarRating, Card } from '@/components/ds';
import { Icon } from '@/components/Icon.jsx';
import { useStore } from '@/context/StoreContext';
import { fmtBRL, finalPrice, galleryFor } from '@/lib/format';
import { categoryLabel } from '@/utils/formatters';
import { getProductReviews } from '@/services/reviewService';
import { useIsTablet, useIsMobile } from '@/hooks/useMediaQuery';
import { Eyebrow, ProductGrid } from './shared.jsx';

// Distribuição ilustrativa do catálogo, usada enquanto não há avaliações reais.
const RATING_BREAKDOWN = [
  { stars: 5, pct: 72 }, { stars: 4, pct: 19 }, { stars: 3, pct: 6 }, { stars: 2, pct: 2 }, { stars: 1, pct: 1 },
];

// Formata a data da avaliação em PT-BR (ex.: "2 de junho de 2026").
function formatReviewDate(createdAt) {
  if (!createdAt) return '';
  return new Date(createdAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Calcula média e distribuição (%) das notas a partir das avaliações reais.
function summarize(reviews) {
  const count = reviews.length;
  if (!count) return null;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  const breakdown = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    pct: Math.round((reviews.filter((r) => r.rating === stars).length / count) * 100),
  }));
  return { count, average: sum / count, breakdown };
}

function Gallery({ images, discount }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(null);
  const ref = useRef(null);
  const onMove = (event) => {
    const bounds = ref.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100));
    const y = Math.max(0, Math.min(100, ((event.clientY - bounds.top) / bounds.height) * 100));
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
          <Icon.ZoomIn size={14} /> Passe o mouse para ampliar
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

function ReviewsBlock({ rating, reviews }) {
  const summary = summarize(reviews);
  const headlineRating = summary ? summary.average : rating;
  const breakdown = summary ? summary.breakdown : RATING_BREAKDOWN;
  const isMobile = useIsMobile();

  return (
    <section style={{ marginTop: 56, borderTop: '1px solid var(--color-gray-200)', paddingTop: 40 }}>
      <Eyebrow>Opiniões</Eyebrow>
      <h2 style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-gray-900)', margin: '6px 0 28px' }}>Avaliações de clientes</h2>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(220px, 280px) 1fr', gap: isMobile ? 24 : 40, alignItems: 'start' }}>
        <Card as="div" style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 'var(--font-extrabold)', color: 'var(--color-gray-900)', lineHeight: 1 }}>{headlineRating.toFixed(1)}</div>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0 6px' }}><StarRating rating={headlineRating} size={18} /></div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>
            {summary ? `Baseado em ${summary.count} ${summary.count > 1 ? 'avaliações' : 'avaliação'}` : 'Nota média do catálogo'}
          </p>
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {breakdown.map((breakdownRow) => (
              <div key={breakdownRow.stars} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', width: 28, display: 'flex', alignItems: 'center', gap: 2 }}>{breakdownRow.stars}<Icon.Star size={11} filled style={{ color: '#f6ad55' }} /></span>
                <div style={{ flex: 1, height: 7, background: 'var(--color-gray-100)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{ width: breakdownRow.pct + '%', height: '100%', background: '#f6ad55' }} />
                </div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)', width: 30, textAlign: 'right' }}>{breakdownRow.pct}%</span>
              </div>
            ))}
          </div>
        </Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {reviews.length === 0 ? (
            <Card variant="dashed" padding={32} style={{ textAlign: 'center', color: 'var(--color-gray-500)' }}>
              <Icon.Star size={28} style={{ color: 'var(--color-gray-300)', marginBottom: 8 }} />
              <p>Este produto ainda não tem avaliações. Compre e seja o primeiro a avaliar!</p>
            </Card>
          ) : (
            reviews.map((review) => {
              const author = review.author_name || 'Cliente';
              return (
                <Card key={review.id} padding={20}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <span style={{ width: 40, height: 40, borderRadius: 'var(--radius-full)', background: 'var(--color-primary-700)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 'var(--font-bold)' }}>{author.charAt(0).toUpperCase()}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-900)' }}>{author}</strong>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: '0.625rem', fontWeight: 'var(--font-bold)', color: 'var(--color-success)', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}><Icon.Check size={12} /> Verificada</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                        <StarRating rating={review.rating} size={13} />
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)' }}>{formatReviewDate(review.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  {review.comment && <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)', lineHeight: 1.65 }}>{review.comment}</p>}
                </Card>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}

export default function Detail() {
  const { nav, addToCart, toggleWish, wish, products, cart } = useStore();
  const { id } = useParams();
  const isTablet = useIsTablet();
  const [qty, setQty] = useState(1);
  const [stockAlert, setStockAlert] = useState('');
  const [reviews, setReviews] = useState([]);
  const productId = Number(id);

  // Avaliações reais do produto (públicas, sem moderação).
  useEffect(() => {
    let active = true;
    if (!Number.isFinite(productId)) return undefined;
    getProductReviews(productId)
      .then((data) => { if (active) setReviews(data); })
      .catch((err) => console.error('Falha ao carregar avaliações:', err));
    return () => { active = false; };
  }, [productId]);
  const product = products.find((item) => item.id === productId) || products[0];
  // Catálogo ainda carregando (lista vazia): evita quebrar antes do fetch concluir.
  if (!product) {
    return (
      <div className="container" style={{ padding: '80px var(--container-padding)', textAlign: 'center', color: 'var(--color-gray-500)' }}>
        Carregando produto…
      </div>
    );
  }
  const discountedPrice = finalPrice(product);
  const images = galleryFor(product);
  const isOut = product.stock <= 0;
  const cartQty = cart[product.id]?.qty || 0;        // já no carrinho
  const maxAddable = Math.max(0, product.stock - cartQty); // ainda pode adicionar

  // Tenta adicionar `qty` ao carrinho, respeitando o estoque disponível.
  const handleAdd = (goToCart) => {
    if (cartQty + qty > product.stock) {
      setStockAlert(
        maxAddable > 0
          ? `Você já tem ${cartQty} no carrinho. Só há ${product.stock} em estoque — pode adicionar mais ${maxAddable}.`
          : `Você já tem o máximo disponível (${product.stock}) no carrinho.`
      );
      return;
    }
    setStockAlert('');
    addToCart(product, qty);
    if (goToCart) nav('cart');
  };
  const amountSaved = product.discountPercentage > 0 ? product.price - discountedPrice : 0;
  const sameCategoryProducts = products
    .filter((item) => item.id !== product.id && item.category === product.category)
    .slice(0, 4);
  const relatedProducts = sameCategoryProducts.length
    ? sameCategoryProducts
    : products.filter((item) => item.id !== product.id).slice(0, 4);
  const trustBadges = [
    { icon: <Icon.Truck size={20} />, title: 'Frete grátis', subtitle: 'Acima de R$ 300' },
    { icon: <Icon.RotateCcw size={20} />, title: 'Troca fácil', subtitle: '30 dias' },
    { icon: <Icon.Shield size={20} />, title: 'Compra segura', subtitle: 'Mercado Pago' },
  ];

  return (
    <div className="container" style={{ padding: '24px var(--container-padding) 64px' }}>
      <button onClick={() => nav('catalog')} style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-gray-500)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--text-sm)', marginBottom: 20 }}>
        <Icon.ChevronLeft size={16} /> Voltar para a loja
      </button>
      <div style={{ display: 'grid', gridTemplateColumns: isTablet ? '1fr' : 'minmax(0, 1fr) minmax(0, 1fr)', gap: isTablet ? 28 : 48, alignItems: 'start' }}>
        <Gallery images={images} discount={product.discountPercentage} />

        <div>
          <Eyebrow>{categoryLabel(product.category)}</Eyebrow>
          <h1 style={{ fontSize: 'var(--text-4xl)', color: 'var(--color-gray-900)', margin: '8px 0 14px', lineHeight: 1.12 }}>{product.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
            <StarRating rating={product.rating} size={18} />
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>
              {product.rating}{reviews.length > 0 ? ` · ${reviews.length} ${reviews.length > 1 ? 'avaliações' : 'avaliação'}` : ''}
            </span>
            <span style={{ fontSize: 'var(--text-sm)', color: isOut || product.stock < 10 ? 'var(--color-danger)' : 'var(--color-success)', fontWeight: 'var(--font-semibold)' }}>
              {isOut ? 'Indisponível' : product.stock < 10 ? `Últimas ${product.stock} unidades` : 'Em estoque'}
            </span>
          </div>

          {/* Bloco de preço */}
          <Card variant="subtle" padding={20} style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 'var(--font-extrabold)', color: 'var(--color-gray-900)', lineHeight: 1, letterSpacing: '-0.02em' }}>{fmtBRL(discountedPrice)}</span>
              {product.discountPercentage > 0 && <span style={{ fontSize: 'var(--text-lg)', color: 'var(--color-gray-400)', textDecoration: 'line-through' }}>{fmtBRL(product.price)}</span>}
              {product.discountPercentage > 0 && <Badge variant="deal">-{Math.round(product.discountPercentage)}%</Badge>}
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)', marginTop: 8 }}>
              {amountSaved > 0 && <span style={{ color: 'var(--color-deal-text)', fontWeight: 'var(--font-bold)' }}>Você economiza {fmtBRL(amountSaved)} · </span>}
              em até <strong style={{ color: 'var(--color-gray-800)' }}>12x de {fmtBRL(discountedPrice / 12)}</strong> sem juros
            </p>
          </Card>

          <p style={{ color: 'var(--color-gray-600)', lineHeight: 1.7, marginBottom: 26 }}>{product.description}</p>

          {/* Qty + CTAs */}
          {isOut && (
            <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fee2e2', color: '#b91c1c', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', marginBottom: 14 }}>
              <Icon.AlertCircle size={18} /> <span>Produto indisponível no momento.</span>
            </div>
          )}
          {!isOut && stockAlert && (
            <div role="alert" aria-live="assertive" style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fef3c7', color: '#92400e', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', marginBottom: 14 }}>
              <Icon.AlertCircle size={18} /> <span>{stockAlert}</span>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--color-gray-300)', borderRadius: 'var(--radius-md)', overflow: 'hidden', opacity: isOut ? 0.5 : 1 }}>
              <button disabled={isOut} onClick={() => { setStockAlert(''); setQty((current) => Math.max(1, current - 1)); }} style={{ padding: 12, background: 'none', border: 'none', cursor: isOut ? 'not-allowed' : 'pointer', color: 'var(--color-gray-600)', display: 'flex' }}><Icon.Minus size={16} /></button>
              <span style={{ width: 44, textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 'var(--font-bold)' }}>{qty}</span>
              <button disabled={isOut} onClick={() => setQty((current) => {
                if (cartQty + current + 1 > product.stock) { setStockAlert(`Só há ${product.stock} unidade(s) em estoque${cartQty ? ` e você já tem ${cartQty} no carrinho` : ''}.`); return current; }
                setStockAlert(''); return current + 1;
              })} style={{ padding: 12, background: 'none', border: 'none', cursor: isOut ? 'not-allowed' : 'pointer', color: 'var(--color-gray-600)', display: 'flex' }}><Icon.Plus size={16} /></button>
            </div>
            <Button variant="deal" size="lg" disabled={isOut} onClick={() => handleAdd(true)} style={{ flex: 1 }}>{isOut ? 'Indisponível' : 'Comprar agora'}</Button>
          </div>
          <Button variant="primary" size="lg" fullWidth disabled={isOut} onClick={() => handleAdd(false)} style={{ marginBottom: 10 }}><Icon.Cart size={18} /> {isOut ? 'Indisponível' : 'Adicionar ao carrinho'}</Button>
          <button onClick={() => toggleWish(product.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '10px', background: 'none', border: 'none', cursor: 'pointer', color: wish[product.id] ? 'var(--color-danger)' : 'var(--color-gray-500)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>
            <Icon.Heart size={18} filled={wish[product.id]} /> {wish[product.id] ? 'Salvo nos favoritos' : 'Adicionar aos favoritos'}
          </button>

          {/* Trust row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginTop: 22 }}>
            {trustBadges.map((badge, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px', background: '#fff', border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ color: 'var(--color-primary-700)', flexShrink: 0 }}>{badge.icon}</span>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)', color: 'var(--color-gray-800)' }}>{badge.title}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--color-gray-500)' }}>{badge.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ReviewsBlock rating={product.rating} reviews={reviews} />

      <section style={{ marginTop: 56 }}>
        <h2 style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-gray-900)', marginBottom: 22 }}>Você também pode gostar</h2>
        <ProductGrid products={relatedProducts} nav={nav} addToCart={addToCart} toggleWish={toggleWish} wish={wish} />
      </section>
    </div>
  );
}
