// src/screens/Wishlist.jsx — grade de favoritos (4 colunas) ou estado vazio
import { ProductCard } from '@/components/ds';
import { useStore } from '@/context/StoreContext';
import { finalPrice } from '@/lib/format';
import { categoryLabel } from '@/utils/formatters';

export default function Wishlist() {
  const { nav, addToCart, toggleWish, wish, products } = useStore();
  const wishlistedProducts = products.filter((product) => wish[product.id]);

  if (!wishlistedProducts.length) {
    return (
      <div className="container" style={{ padding: '64px var(--container-padding)', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-gray-900)', marginBottom: 12 }}>Sua lista está vazia</h1>
        <p style={{ color: 'var(--color-gray-500)' }}>Toque no coração de um produto para salvá-lo aqui.</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px var(--container-padding) 64px' }}>
      <h1 style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-gray-900)', marginBottom: 24 }}>Lista de Desejos</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 24 }}>
        {wishlistedProducts.map((product) => (
          <div key={product.id} onClick={() => nav('detail', product.id)} style={{ cursor: 'pointer' }}>
            <ProductCard
              title={product.title} category={categoryLabel(product.category)} price={finalPrice(product)} originalPrice={product.price}
              discountPercentage={product.discountPercentage} rating={product.rating} thumbnail={product.thumbnail}
              wishlisted={!!wish[product.id]}
              outOfStock={product.stock <= 0}
              onAddToCart={(e) => { e && e.stopPropagation(); addToCart(product); }}
              onToggleWishlist={(e) => { e && e.stopPropagation(); toggleWish(product.id); }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
