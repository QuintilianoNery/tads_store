// src/screens/Catalog.jsx — trilha de filtros + toolbar de ordenação + grade
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { StarRating } from '@/components/ds';
import { useStore } from '@/context/StoreContext';
import { finalPrice } from '@/lib/format';
import { categoryLabel } from '@/utils/formatters';
import { ProductGrid } from './shared.jsx';

function FilterGroup({ title, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <h3 style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)', color: 'var(--color-gray-900)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>{title}</h3>
      {children}
    </div>
  );
}

export default function Catalog() {
  const { nav, addToCart, toggleWish, wish, products, search, setSearch, categories } = useStore();
  const initialCategory = useLocation().state?.cat || null;
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'Todos');
  const [sortOrder, setSortOrder] = useState('relevancia');
  const [ratingFilter, setRatingFilter] = useState('all'); // all | high (4+) | low (3-)
  const [dealsFilter, setDealsFilter] = useState('all');    // all | with | without
  // Ao chegar numa categoria pela navegação (menu/Home), troca a categoria e
  // zera os filtros — eles não devem "vazar" entre categorias.
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
      setRatingFilter('all');
      setDealsFilter('all');
    }
  }, [initialCategory]);

  let visibleProducts =
    selectedCategory === 'Todos'
      ? products.slice()
      : products.filter((product) => product.category === selectedCategory);
  if (search) visibleProducts = visibleProducts.filter((product) => product.title.toLowerCase().includes(search.toLowerCase()));
  if (ratingFilter === 'high') visibleProducts = visibleProducts.filter((product) => product.rating >= 4);
  else if (ratingFilter === 'low') visibleProducts = visibleProducts.filter((product) => product.rating <= 3);
  if (dealsFilter === 'with') visibleProducts = visibleProducts.filter((product) => product.discountPercentage > 0);
  else if (dealsFilter === 'without') visibleProducts = visibleProducts.filter((product) => !(product.discountPercentage > 0));
  if (sortOrder === 'menor') visibleProducts.sort((a, b) => finalPrice(a) - finalPrice(b));
  else if (sortOrder === 'maior') visibleProducts.sort((a, b) => finalPrice(b) - finalPrice(a));
  else if (sortOrder === 'avaliados') visibleProducts.sort((a, b) => b.rating - a.rating);
  else if (sortOrder === 'desconto') visibleProducts.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));

  const countByCategory = (category) =>
    category === 'Todos'
      ? products.length
      : products.filter((product) => product.category === category).length;

  return (
    <div className="container" style={{ padding: '32px var(--container-padding) 64px' }}>
      <div style={{ marginBottom: 22 }}>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)' }}>Início / <span style={{ color: 'var(--color-gray-600)' }}>{categoryLabel(selectedCategory)}</span></span>
        <h1 style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-gray-900)', marginTop: 4 }}>{selectedCategory === 'Todos' ? 'Todos os produtos' : categoryLabel(selectedCategory)}</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '236px minmax(0, 1fr)', gap: 28, alignItems: 'start' }}>
        {/* Trilha de filtros */}
        <aside style={{ background: '#fff', border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-lg)', padding: 20, boxShadow: 'var(--shadow-sm)', position: 'sticky', top: 24 }}>
          <FilterGroup title="Categorias">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {categories.map((category) => (
                <button key={category} onClick={() => { setSearch(''); setSelectedCategory(category); setRatingFilter('all'); setDealsFilter('all'); }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 10px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'all var(--transition-fast)',
                    background: selectedCategory === category ? 'var(--color-primary-50)' : 'transparent', color: selectedCategory === category ? 'var(--color-primary-800)' : 'var(--color-gray-600)', fontWeight: selectedCategory === category ? 'var(--font-bold)' : 'var(--font-medium)', fontSize: 'var(--text-sm)' }}>
                  {categoryLabel(category)} <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)' }}>{countByCategory(category)}</span>
                </button>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title="Avaliação">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { value: 'all', label: 'Todas' },
                { value: 'high', stars: 4, suffix: 'e acima' },
                { value: 'low', stars: 3, suffix: 'e abaixo' },
              ].map((option) => (
                <button key={option.value} onClick={() => setRatingFilter(option.value)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer', textAlign: 'left',
                    background: ratingFilter === option.value ? 'var(--color-primary-50)' : 'transparent', color: 'var(--color-gray-600)', fontSize: 'var(--text-sm)', fontWeight: ratingFilter === option.value ? 'var(--font-bold)' : 'var(--font-medium)' }}>
                  {option.stars ? <><StarRating rating={option.stars} size={13} /> {option.suffix}</> : option.label}
                </button>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title="Ofertas">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { value: 'all', label: 'Todas' },
                { value: 'with', label: 'Só com ofertas' },
                { value: 'without', label: 'Sem ofertas' },
              ].map((option) => (
                <button key={option.value} onClick={() => setDealsFilter(option.value)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer', textAlign: 'left',
                    background: dealsFilter === option.value ? 'var(--color-primary-50)' : 'transparent', color: 'var(--color-gray-600)', fontSize: 'var(--text-sm)', fontWeight: dealsFilter === option.value ? 'var(--font-bold)' : 'var(--font-medium)' }}>
                  {option.label}
                </button>
              ))}
            </div>
          </FilterGroup>
        </aside>

        {/* Resultados */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', background: '#fff', border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: 20, boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)' }}>
              <strong style={{ color: 'var(--color-gray-900)' }}>{visibleProducts.length}</strong> produto{visibleProducts.length !== 1 ? 's' : ''}{search ? ` para “${search}”` : ''}
            </span>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>
              Ordenar por
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}
                style={{ padding: '8px 10px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-gray-200)', background: '#fff', color: 'var(--color-gray-800)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', cursor: 'pointer' }}>
                <option value="relevancia">Relevância</option>
                <option value="menor">Menor preço</option>
                <option value="maior">Maior preço</option>
                <option value="avaliados">Mais avaliados</option>
                <option value="desconto">Maior desconto</option>
              </select>
            </label>
          </div>
          {visibleProducts.length ? (
            <ProductGrid products={visibleProducts} nav={nav} addToCart={addToCart} toggleWish={toggleWish} wish={wish} />
          ) : (
            <div style={{ background: '#fff', border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-lg)', padding: '56px 0', textAlign: 'center', color: 'var(--color-gray-500)' }}>
              Nenhum produto encontrado com esses filtros.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
