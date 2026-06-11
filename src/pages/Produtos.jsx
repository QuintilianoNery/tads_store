// src/pages/Produtos.jsx
import { useState, useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, Grid3x3, List } from 'lucide-react'
import Vitrine from '@/components/product/Vitrine/Vitrine'
import useFetch from '@/hooks/useFetch'
import useDebounce from '@/hooks/useDebounce'
import { getProducts, searchProducts, getCategories, getProductsByCategory } from '@/services/productService'
import { slugToLabel } from '@/utils/formatters'
import styles from './Produtos.module.css'

const LIMIT = 12

const SORT_OPTIONS = [
  { value: 'default',     label: 'Ordenação padrão' },
  { value: 'price-asc',  label: 'Menor preço' },
  { value: 'price-desc', label: 'Maior preço' },
  { value: 'rating',     label: 'Melhor avaliação' },
  { value: 'title-asc',  label: 'A → Z' },
  { value: 'title-desc', label: 'Z → A' },
]

function sortProducts(products, sort) {
  const sorted = [...products]
  switch (sort) {
    case 'price-asc':  return sorted.sort((a, b) => a.price - b.price)
    case 'price-desc': return sorted.sort((a, b) => b.price - a.price)
    case 'rating':     return sorted.sort((a, b) => b.rating - a.rating)
    case 'title-asc':  return sorted.sort((a, b) => a.title.localeCompare(b.title))
    case 'title-desc': return sorted.sort((a, b) => b.title.localeCompare(a.title))
    default:           return sorted
  }
}

function Produtos() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Estados de filtro e UI
  const [busca, setBusca] = useState(searchParams.get('busca') ?? '')
  const [categoria, setCategoria] = useState(searchParams.get('categoria') ?? '')
  const [sort, setSort] = useState('default')
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'

  const debouncedBusca = useDebounce(busca, 400)

  // Sincroniza busca na URL
  useEffect(() => {
    const params = {}
    if (debouncedBusca) params.busca = debouncedBusca
    if (categoria) params.categoria = categoria
    setSearchParams(params, { replace: true })
    setPage(1)
  }, [debouncedBusca, categoria, setSearchParams])

  // ── Categorias ──────────────────────────────────────────────
  const fetchCategories = useCallback(() => getCategories(), [])
  const { data: categoriesData } = useFetch(fetchCategories)
  const categories = categoriesData ?? []

  // ── Produtos ────────────────────────────────────────────────
  const skip = (page - 1) * LIMIT

  const fetchProducts = useCallback(() => {
    if (debouncedBusca.trim()) {
      return searchProducts(debouncedBusca.trim(), { limit: LIMIT, skip })
    }
    if (categoria) {
      return getProductsByCategory(categoria, { limit: LIMIT, skip })
    }
    return getProducts({ limit: LIMIT, skip })
  }, [debouncedBusca, categoria, skip])

  const { data, isLoading, error } = useFetch(fetchProducts, [fetchProducts])

  const rawProducts = data?.products ?? []
  const total       = data?.total ?? 0
  const totalPages  = Math.ceil(total / LIMIT)

  const produtos = sortProducts(rawProducts, sort)

  // ── Handlers ────────────────────────────────────────────────
  function handleCategoryChange(cat) {
    setCategoria(cat === categoria ? '' : cat)
    setPage(1)
  }

  function handleClearFilters() {
    setBusca('')
    setCategoria('')
    setSort('default')
    setPage(1)
  }

  const hasFilters = busca || categoria || sort !== 'default'

  return (
    <div className={styles.page}>
      <div className="container">
        {/* ── Cabeçalho da página ── */}
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Produtos</h1>
            {!isLoading && (
              <p className={styles.pageCount}>
                {total > 0 ? `${total} produtos encontrados` : 'Nenhum produto encontrado'}
              </p>
            )}
          </div>

          {/* Controles de view e sort */}
          <div className={styles.controls}>
            <div className={styles.viewToggle} role="group" aria-label="Modo de visualização">
              <button
                className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.activeView : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Visualização em grade"
                aria-pressed={viewMode === 'grid'}
              >
                <Grid3x3 size={18} />
              </button>
              <button
                className={`${styles.viewBtn} ${viewMode === 'list' ? styles.activeView : ''}`}
                onClick={() => setViewMode('list')}
                aria-label="Visualização em lista"
                aria-pressed={viewMode === 'list'}
              >
                <List size={18} />
              </button>
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className={styles.sortSelect}
              aria-label="Ordenar produtos"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.layout}>
          {/* ── Sidebar de filtros ── */}
          <aside className={styles.sidebar} aria-label="Filtros">
            <div className={styles.filterBlock}>
              <h2 className={styles.filterTitle}>
                <SlidersHorizontal size={16} aria-hidden="true" />
                Filtros
              </h2>

              {/* Busca */}
              <div className={styles.filterSection}>
                <label htmlFor="busca-input" className={styles.filterLabel}>Buscar</label>
                <input
                  id="busca-input"
                  type="search"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Nome do produto..."
                  className={styles.buscaInput}
                  aria-label="Buscar produto por nome"
                />
              </div>

              {/* Categorias */}
              <div className={styles.filterSection}>
                <h3 className={styles.filterLabel}>Categorias</h3>
                <ul className={styles.categoryList}>
                  {categories.map((cat) => {
                    const slug = cat.slug ?? cat
                    const name = cat.name ?? slugToLabel(cat)
                    return (
                      <li key={slug}>
                        <button
                          className={`${styles.categoryBtn} ${categoria === slug ? styles.activeCategory : ''}`}
                          onClick={() => handleCategoryChange(slug)}
                          aria-pressed={categoria === slug}
                        >
                          {name}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>

              {/* Limpar filtros */}
              {hasFilters && (
                <button className={styles.clearBtn} onClick={handleClearFilters}>
                  Limpar filtros
                </button>
              )}
            </div>
          </aside>

          {/* ── Vitrine ── */}
          <div className={styles.content}>
            <Vitrine
              produtos={produtos}
              isLoading={isLoading}
              error={error}
              columns={viewMode === 'grid' ? 3 : 1}
            />

            {/* ── Paginação ── */}
            {!isLoading && totalPages > 1 && (
              <nav className={styles.pagination} aria-label="Paginação de produtos">
                <button
                  className={styles.pageBtn}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  aria-label="Página anterior"
                >
                  ←
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...')
                    acc.push(p)
                    return acc
                  }, [])
                  .map((item, idx) =>
                    item === '...' ? (
                      <span key={`ellipsis-${idx}`} className={styles.ellipsis}>…</span>
                    ) : (
                      <button
                        key={item}
                        className={`${styles.pageBtn} ${page === item ? styles.activePage : ''}`}
                        onClick={() => setPage(item)}
                        aria-label={`Ir para página ${item}`}
                        aria-current={page === item ? 'page' : undefined}
                      >
                        {item}
                      </button>
                    )
                  )}

                <button
                  className={styles.pageBtn}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  aria-label="Próxima página"
                >
                  →
                </button>
              </nav>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Produtos
