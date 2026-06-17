// src/utils/formatters.js
// Funções puras de formatação — sem side-effects

/**
 * Formata número como moeda brasileira.
 * @example formatPrice(3499.9) → "R$ 3.499,90"
 */
export function formatPrice(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value ?? 0)
}

/**
 * Calcula preço com desconto aplicado.
 */
export function calcDiscountedPrice(price, discountPercentage) {
  if (!discountPercentage) return price
  return +(price * (1 - discountPercentage / 100)).toFixed(2)
}

/**
 * Formata data para pt-BR.
 * @example formatDate("2026-06-06") → "6 de junho de 2026"
 */
export function formatDate(dateString) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString))
}

/**
 * Trunca texto em N caracteres, adicionando "…".
 */
export function truncate(text, maxLength = 80) {
  if (!text) return ''
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text
}

/**
 * Converte slug para nome legível.
 * @example slugToLabel("mens-shirts") → "Mens Shirts"
 */
export function slugToLabel(slug) {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Tradução pt-BR dos slugs de categoria do DummyJSON (categorias em inglês).
 */
const CATEGORY_PT_BR = {
  beauty: 'Beleza',
  fragrances: 'Perfumes',
  furniture: 'Móveis',
  groceries: 'Mercearia',
  'home-decoration': 'Decoração',
  'kitchen-accessories': 'Acessórios de Cozinha',
  laptops: 'Notebooks',
  'mens-shirts': 'Camisas Masculinas',
  'mens-shoes': 'Calçados Masculinos',
  'mens-watches': 'Relógios Masculinos',
  'mobile-accessories': 'Acessórios para Celular',
  motorcycle: 'Motocicletas',
  'skin-care': 'Cuidados com a Pele',
  smartphones: 'Smartphones',
  'sports-accessories': 'Acessórios Esportivos',
  sunglasses: 'Óculos de Sol',
  tablets: 'Tablets',
  tops: 'Blusas',
  vehicle: 'Veículos',
  'womens-bags': 'Bolsas Femininas',
  'womens-dresses': 'Vestidos Femininos',
  'womens-jewellery': 'Joias Femininas',
  'womens-shoes': 'Calçados Femininos',
  'womens-watches': 'Relógios Femininos',
}

/**
 * Rótulo de categoria em pt-BR. Usa o mapa de tradução e cai no slugToLabel
 * para qualquer slug novo que ainda não tenha tradução.
 * @example categoryLabel("mens-watches") → "Relógios Masculinos"
 */
export function categoryLabel(slug) {
  if (!slug) return ''
  return CATEGORY_PT_BR[slug] ?? slugToLabel(slug)
}

/**
 * Gera classe CSS de estrelas com base no rating (0–5).
 */
export function getRatingStars(rating) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5 ? 1 : 0
  const empty = 5 - full - half
  return { full, half, empty }
}
