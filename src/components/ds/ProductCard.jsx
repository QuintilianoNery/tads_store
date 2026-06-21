import React from 'react';
import { Badge } from './Badge.jsx';
import { StarRating } from './StarRating.jsx';
import { useIsTouch } from '@/hooks/useMediaQuery';

const HEART_PATH =
  'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z';

function IconBtn({ children, active, onClick, label, disabled }) {
  const [hover, setHover] = React.useState(false);
  const activeBg = active ? 'var(--color-danger)' : 'var(--color-primary-800)';
  return (
    <button
      onClick={disabled ? undefined : onClick}
      aria-label={label}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '2rem',
        height: '2rem',
        background: !disabled && hover ? activeBg : 'var(--color-white)',
        color: disabled ? 'var(--color-gray-300)' : hover ? 'var(--color-white)' : active ? 'var(--color-danger)' : 'var(--color-gray-600)',
        border: 'none',
        borderRadius: 'var(--radius-full)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-md)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all var(--transition-fast)',
      }}
    >
      {children}
    </button>
  );
}

/**
 * ProductCard — o tile de produto símbolo da loja.
 * Imagem quadrada, badge de promoção, ações em hover (favorito + carrinho),
 * eyebrow de categoria, título truncado, avaliação por estrelas, preço com original.
 */
export function ProductCard({
  title = 'Produto',
  category = 'categoria',
  price = 0,
  originalPrice,
  discountPercentage = 0,
  rating = 0,
  thumbnail,
  wishlisted = false,
  outOfStock = false,
  onAddToCart,
  onToggleWishlist,
  style,
  ...props
}) {
  const [hover, setHover] = React.useState(false);
  const isOnSale = discountPercentage > 0;
  const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v ?? 0);
  // Em telas de toque não há hover: as ações (favoritar/carrinho) ficam sempre
  // visíveis para continuarem acessíveis no celular/tablet.
  const isTouch = useIsTouch();
  const showActions = hover || isTouch;

  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: 'var(--color-white)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: hover ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
        border: '1px solid var(--color-gray-100)',
        transition: 'box-shadow var(--transition-base), transform var(--transition-base)',
        transform: hover ? 'translateY(-2px)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        ...style,
      }}
      {...props}
    >
      {/* Imagem */}
      <div style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', background: 'var(--color-gray-100)' }}>
        {thumbnail && (
          <img
            src={thumbnail}
            alt={title}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform var(--transition-slow)',
              transform: hover ? 'scale(1.04)' : 'none',
              opacity: outOfStock ? 0.55 : 1,
            }}
          />
        )}

        {isOnSale && !outOfStock && (
          <div style={{ position: 'absolute', top: 'var(--space-3)', left: 'var(--space-3)' }}>
            <Badge variant="deal" size="sm">-{Math.round(discountPercentage)}%</Badge>
          </div>
        )}

        {outOfStock && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <span style={{ background: 'var(--color-gray-800)', color: 'var(--color-white)', fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '6px 14px', borderRadius: 'var(--radius-full)', boxShadow: 'var(--shadow-md)' }}>
              Esgotado
            </span>
          </div>
        )}

        <div
          style={{
            position: 'absolute',
            top: 'var(--space-3)',
            right: 'var(--space-3)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
            opacity: showActions ? 1 : 0,
            transform: showActions ? 'translateX(0)' : 'translateX(8px)',
            transition: 'opacity var(--transition-base), transform var(--transition-base)',
          }}
        >
          <IconBtn active={wishlisted} onClick={onToggleWishlist} label="Lista de desejos">
            <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={HEART_PATH} />
            </svg>
          </IconBtn>
          <IconBtn onClick={onAddToCart} disabled={outOfStock} label={outOfStock ? 'Produto indisponível' : 'Adicionar ao carrinho'}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
          </IconBtn>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', flex: 1 }}>
        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {category}
        </span>

        <h3
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-semibold)',
            color: 'var(--color-gray-800)',
            lineHeight: 'var(--leading-tight)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {title}
        </h3>

        <StarRating rating={rating} size={13} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'auto' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)', color: 'var(--color-primary-800)' }}>
            {fmt(price)}
          </span>
          {isOnSale && originalPrice && (
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-400)', textDecoration: 'line-through' }}>
              {fmt(originalPrice)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
