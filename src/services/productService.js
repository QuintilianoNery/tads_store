// src/services/productService.js
// Camada de acesso à API DummyJSON — toda chamada de produto passa por aqui

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://dummyjson.com'

/**
 * Utilitário interno: faz fetch e trata erros de rede e HTTP.
 */
async function apiFetch(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`)
  if (!response.ok) {
    throw new Error(`Erro ${response.status}: ${response.statusText}`)
  }
  return response.json()
}

/**
 * Lista produtos com paginação.
 * @param {number} limit - Itens por página (padrão: 12)
 * @param {number} skip  - Offset (página * limit)
 * @returns {{ products: Product[], total: number, skip: number, limit: number }}
 */
export async function getProducts({ limit = 12, skip = 0 } = {}) {
  return apiFetch(`/products?limit=${limit}&skip=${skip}&select=id,title,price,discountPercentage,rating,stock,thumbnail,category,brand`)
}

/**
 * Retorna TODOS os produtos com os campos completos (description, images, etc.).
 * Usado pelo catálogo em memória (StoreContext) que filtra/busca localmente.
 * limit=0 no DummyJSON desativa a paginação e devolve a lista inteira.
 */
export async function getAllProducts() {
  return apiFetch('/products?limit=0')
}

/**
 * Busca produtos por texto.
 * @param {string} query - Termo de busca
 */
export async function searchProducts(query, { limit = 12, skip = 0 } = {}) {
  return apiFetch(`/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`)
}

/**
 * Retorna os detalhes completos de um produto pelo ID.
 * @param {number|string} id
 */
export async function getProductById(id) {
  return apiFetch(`/products/${id}`)
}

/**
 * Atualiza o estoque de um produto na API (DummyJSON simula a alteração e
 * devolve o produto atualizado, sem persistir de fato). Chamado ao finalizar
 * um pedido para refletir o consumo do estoque.
 * @param {number|string} id
 * @param {number} stock - Nova quantidade em estoque
 */
export async function updateProductStock(id, stock) {
  const response = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stock }),
  })
  if (!response.ok) {
    throw new Error(`Erro ${response.status}: ${response.statusText}`)
  }
  return response.json()
}

/**
 * Lista todas as categorias disponíveis.
 * @returns {Category[]} Array de objetos { slug, name, url }
 */
export async function getCategories() {
  return apiFetch('/products/categories')
}

/**
 * Lista produtos de uma categoria específica.
 * @param {string} category - Slug da categoria
 */
export async function getProductsByCategory(category, { limit = 12, skip = 0 } = {}) {
  return apiFetch(`/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`)
}

/**
 * Retorna produtos em destaque (primeiros 8).
 */
export async function getFeaturedProducts() {
  return apiFetch('/products?limit=8&skip=0&select=id,title,price,discountPercentage,rating,thumbnail,category')
}
