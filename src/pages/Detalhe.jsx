// src/pages/Detalhe.jsx
import { useState, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Heart, ShoppingCart, ChevronLeft, ChevronRight, Minus, Plus, Star } from 'lucide-react'
import Button from '@/components/ui/Button/Button'
import Badge from '@/components/ui/Badge/Badge'
import StarRating from '@/components/ui/StarRating/StarRating'
import Spinner from '@/components/ui/Spinner/Spinner'
import useFetch from '@/hooks/useFetch'
import useCartStore from '@/store/cartStore'
import useWishlistStore from '@/store/wishlistStore'
import { getProductById } from '@/services/productService'
import { formatPrice, calcDiscountedPrice } from '@/utils/formatters'
import styles from './Detalhe.module.css'

const TABS = ['Descrição', 'Informação adicional', 'Avaliações']

function Detalhe() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize]   = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [quantity, setQuantity]           = useState(1)
  const [activeTab, setActiveTab]         = useState(0)

  const addToCart    = useCartStore((s) => s.addItem)
  const { toggle, isWishlisted } = useWishlistStore()

  const fetchFn = useCallback(() => getProductById(id), [id])
  const { data: produto, isLoading, error } = useFetch(fetchFn)

  if (isLoading) return <Spinner message="Carregando produto..." />

  if (error || !produto) {
    return (
      <div className={styles.errorState}>
        <p>Produto não encontrado.</p>
        <Button onClick={() => navigate('/produtos')}>Voltar ao catálogo</Button>
      </div>
    )
  }

  const {
    title, price, discountPercentage, rating, stock,
    description, brand, category, thumbnail, images = [],
  } = produto

  const gallery     = images.length > 0 ? images : [thumbnail]
  const finalPrice  = calcDiscountedPrice(price, discountPercentage)
  const isOnSale    = discountPercentage > 0
  const wishlisted  = isWishlisted(id)

  function handleAddToCart() {
    addToCart(produto, quantity, { size: selectedSize, color: selectedColor })
  }

  function handleQuantityChange(delta) {
    setQuantity((q) => Math.max(1, Math.min(stock, q + delta)))
  }

  // Opções de variação simuladas (DummyJSON não tem variações reais)
  const SIZES  = ['XS', 'S', 'M', 'L', 'XL']
  const COLORS = ['Verde', 'Preto', 'Branco', 'Azul']

  return (
    <div className={styles.page}>
      <div className="container">
        {/* ── Breadcrumb ── */}
        <nav className={styles.breadcrumb} aria-label="Localização atual">
          <Link to="/">Início</Link>
          <span aria-hidden="true">/</span>
          <Link to="/produtos">Produtos</Link>
          <span aria-hidden="true">/</span>
          <Link to={`/produtos?categoria=${category}`}>{category}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{title}</span>
        </nav>

        <div className={styles.grid}>
          {/* ── Galeria ── */}
          <section className={styles.gallery} aria-label="Galeria de imagens">
            <div className={styles.mainImage}>
              <img
                src={gallery[selectedImage]}
                alt={`${title} — imagem ${selectedImage + 1}`}
                className={styles.mainImg}
              />

              {/* Setas de navegação */}
              {gallery.length > 1 && (
                <>
                  <button
                    className={`${styles.galleryNav} ${styles.galleryNavPrev}`}
                    onClick={() => setSelectedImage((i) => (i - 1 + gallery.length) % gallery.length)}
                    aria-label="Imagem anterior"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    className={`${styles.galleryNav} ${styles.galleryNavNext}`}
                    onClick={() => setSelectedImage((i) => (i + 1) % gallery.length)}
                    aria-label="Próxima imagem"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {gallery.length > 1 && (
              <div className={styles.thumbnails} role="list" aria-label="Miniaturas do produto">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    className={`${styles.thumb} ${selectedImage === i ? styles.activeThumb : ''}`}
                    onClick={() => setSelectedImage(i)}
                    aria-label={`Ver imagem ${i + 1}`}
                    aria-pressed={selectedImage === i}
                    role="listitem"
                  >
                    <img src={img} alt="" />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* ── Info ── */}
          <section className={styles.info} aria-label="Informações do produto">
            {isOnSale && (
              <Badge variant="danger">SALE -{Math.round(discountPercentage)}%</Badge>
            )}

            <h1 className={styles.title}>{title}</h1>

            <div className={styles.meta}>
              <StarRating rating={rating} count={Math.floor(rating * 20)} />
              <span className={styles.metaDivider}>·</span>
              <span className={styles.stockInfo}>
                {stock > 0
                  ? <><span className={styles.inStock}>●</span> {stock} em estoque</>
                  : <span className={styles.outStock}>Esgotado</span>
                }
              </span>
            </div>

            {/* Preço */}
            <div className={styles.pricing}>
              <span className={styles.price}>{formatPrice(finalPrice)}</span>
              {isOnSale && <span className={styles.original}>{formatPrice(price)}</span>}
            </div>

            <p className={styles.description}>{description}</p>

            {/* Tamanho */}
            <div className={styles.variantGroup}>
              <span className={styles.variantLabel}>
                Tamanho{selectedSize ? `: ${selectedSize}` : ''}
              </span>
              <div className={styles.variantBtns} role="group" aria-label="Selecionar tamanho">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    className={`${styles.variantBtn} ${selectedSize === s ? styles.activeVariant : ''}`}
                    onClick={() => setSelectedSize(selectedSize === s ? null : s)}
                    aria-pressed={selectedSize === s}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Cor */}
            <div className={styles.variantGroup}>
              <span className={styles.variantLabel}>
                Cor{selectedColor ? `: ${selectedColor}` : ''}
              </span>
              <div className={styles.variantBtns} role="group" aria-label="Selecionar cor">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    className={`${styles.variantBtn} ${selectedColor === c ? styles.activeVariant : ''}`}
                    onClick={() => setSelectedColor(selectedColor === c ? null : c)}
                    aria-pressed={selectedColor === c}
                  >
                    {c}
                  </button>
                ))}
              </div>
              {(selectedSize || selectedColor) && (
                <button
                  className={styles.clearVariant}
                  onClick={() => { setSelectedSize(null); setSelectedColor(null) }}
                >
                  Limpar seleção
                </button>
              )}
            </div>

            {/* Quantidade */}
            <div className={styles.quantityGroup}>
              <span className={styles.variantLabel}>Quantidade</span>
              <div className={styles.quantityControl}>
                <button
                  className={styles.qtyBtn}
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  aria-label="Diminuir quantidade"
                >
                  <Minus size={16} />
                </button>
                <span className={styles.qtyValue} aria-live="polite">{quantity}</span>
                <button
                  className={styles.qtyBtn}
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= stock}
                  aria-label="Aumentar quantidade"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className={styles.ctas}>
              <Button
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                disabled={stock === 0}
                fullWidth
              >
                <ShoppingCart size={18} aria-hidden="true" />
                {stock > 0 ? 'Adicionar ao carrinho' : 'Esgotado'}
              </Button>

              <button
                className={`${styles.wishlistBtn} ${wishlisted ? styles.wishlisted : ''}`}
                onClick={() => toggle(produto)}
                aria-label={wishlisted ? 'Remover da lista de desejos' : 'Adicionar à lista de desejos'}
              >
                <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
                {wishlisted ? 'Favoritado' : 'Favoritar'}
              </button>
            </div>

            {/* Detalhes */}
            <dl className={styles.details}>
              {brand    && <><dt>Marca:</dt>    <dd>{brand}</dd></>}
              <dt>Categoria:</dt>   <dd>{category}</dd>
              <dt>Avaliação:</dt>   <dd><StarRating rating={rating} size={12} /></dd>
            </dl>
          </section>
        </div>

        {/* ── Abas ── */}
        <section className={styles.tabs}>
          <div className={styles.tabList} role="tablist" aria-label="Informações do produto">
            {TABS.map((tab, i) => (
              <button
                key={tab}
                role="tab"
                id={`tab-${i}`}
                aria-selected={activeTab === i}
                aria-controls={`tabpanel-${i}`}
                className={`${styles.tabBtn} ${activeTab === i ? styles.activeTab : ''}`}
                onClick={() => setActiveTab(i)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div
            id={`tabpanel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
            className={styles.tabPanel}
          >
            {activeTab === 0 && <p className={styles.tabText}>{description}</p>}
            {activeTab === 1 && (
              <dl className={styles.infoTable}>
                {brand && <><dt>Marca</dt><dd>{brand}</dd></>}
                <dt>Categoria</dt><dd>{category}</dd>
                <dt>Estoque</dt><dd>{stock} unidades</dd>
                <dt>Avaliação</dt><dd>{rating} / 5</dd>
              </dl>
            )}
            {activeTab === 2 && (
              <div className={styles.reviews}>
                <div className={styles.reviewSummary}>
                  <span className={styles.reviewScore}>{rating}</span>
                  <StarRating rating={rating} size={20} />
                  <span className={styles.reviewCount}>{Math.floor(rating * 20)} avaliações</span>
                </div>
                <p className={styles.noReviews}>Seja o primeiro a avaliar este produto.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Detalhe
