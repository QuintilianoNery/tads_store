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
      {products.map((product) => (
        <div key={product.id} onClick={() => nav('detail', product.id)} style={{ cursor: 'pointer' }}>
          <ProductCard
            title={product.title} category={categoryLabel(product.category)} price={finalPrice(product)} originalPrice={product.price}
            discountPercentage={product.discountPercentage} rating={product.rating} thumbnail={product.thumbnail}
            wishlisted={!!wish[product.id]}
            outOfStock={product.stock <= 0}
            onAddToCart={(e) => { e && e.stopPropagation && e.stopPropagation(); addToCart(product); }}
            onToggleWishlist={(e) => { e && e.stopPropagation && e.stopPropagation(); toggleWish(product.id); }}
          />
        </div>
      ))}
    </div>
  );
}
