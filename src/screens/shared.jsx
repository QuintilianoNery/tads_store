// src/screens/shared.jsx — peças reutilizadas pelas telas (eyebrow + grade de produtos)
import { ProductCard } from '@/components/ds';
import { finalPrice } from '@/lib/format';
import { categoryLabel } from '@/utils/formatters';

export function Eyebrow({ children, color }) {
  return (
    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)', color: color || 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
      {children}
    </span>
  );
}

export function ProductGrid({ products, nav, addToCart, toggleWish, wish, minWidth = 230 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}px, 1fr))`, gap: 24 }}>
      {products.map((p) => (
        <div key={p.id} onClick={() => nav('detail', p.id)} style={{ cursor: 'pointer' }}>
          <ProductCard
            title={p.title} category={categoryLabel(p.category)} price={finalPrice(p)} originalPrice={p.price}
            discountPercentage={p.discountPercentage} rating={p.rating} thumbnail={p.thumbnail}
            wishlisted={!!wish[p.id]}
            onAddToCart={(e) => { e && e.stopPropagation && e.stopPropagation(); addToCart(p); }}
            onToggleWishlist={(e) => { e && e.stopPropagation && e.stopPropagation(); toggleWish(p.id); }}
          />
        </div>
      ))}
    </div>
  );
}
