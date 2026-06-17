// src/screens/Wishlist.jsx — grade de favoritos (4 colunas) ou estado vazio
import { ProductCard } from '@/components/ds';
import { useStore } from '@/context/StoreContext';
import { finalPrice } from '@/lib/format';
import { categoryLabel } from '@/utils/formatters';

export default function Wishlist() {
  const { nav, addToCart, toggleWish, wish, products } = useStore();
  const list = products.filter((p) => wish[p.id]);

  if (!list.length) {
    return (
      <div className="container" style={{ padding: '64px 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-gray-900)', marginBottom: 12 }}>Sua lista está vazia</h1>
        <p style={{ color: 'var(--color-gray-500)' }}>Toque no coração de um produto para salvá-lo aqui.</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 0 64px' }}>
      <h1 style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-gray-900)', marginBottom: 24 }}>Lista de Desejos</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
        {list.map((p) => (
          <div key={p.id} onClick={() => nav('detail', p.id)} style={{ cursor: 'pointer' }}>
            <ProductCard
              title={p.title} category={categoryLabel(p.category)} price={finalPrice(p)} originalPrice={p.price}
              discountPercentage={p.discountPercentage} rating={p.rating} thumbnail={p.thumbnail}
              wishlisted={!!wish[p.id]}
              onAddToCart={(e) => { e && e.stopPropagation(); addToCart(p); }}
              onToggleWishlist={(e) => { e && e.stopPropagation(); toggleWish(p.id); }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
