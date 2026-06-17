// src/lib/format.js — helpers de formatação e preço (pt-BR / BRL)

export const fmtBRL = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

/** Preço final aplicando o desconto percentual, se houver. */
export const finalPrice = (product) =>
  product.discountPercentage
    ? +(product.price * (1 - product.discountPercentage / 100)).toFixed(2)
    : product.price;

/** Constrói uma pequena galeria a partir de uma foto Unsplash usando crops diferentes. */
export const galleryFor = (product) => {
  const baseImageUrl = (product.thumbnail || '').split('?')[0];
  const unsplashParams = '?w=1000&q=80&auto=format&fit=crop';
  return [
    baseImageUrl + unsplashParams,
    baseImageUrl + unsplashParams + '&crop=entropy',
    baseImageUrl + unsplashParams + '&crop=top',
    baseImageUrl + unsplashParams + '&crop=bottom',
  ];
};
