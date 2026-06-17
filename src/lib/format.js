// src/lib/format.js — helpers de formatação e preço (pt-BR / BRL)

export const fmtBRL = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

/** Preço final aplicando o desconto percentual, se houver. */
export const finalPrice = (p) =>
  p.discountPercentage ? +(p.price * (1 - p.discountPercentage / 100)).toFixed(2) : p.price;

/** Constrói uma pequena galeria a partir de uma foto Unsplash usando crops diferentes. */
export const galleryFor = (p) => {
  const base = (p.thumbnail || '').split('?')[0];
  const q = '?w=1000&q=80&auto=format&fit=crop';
  return [base + q, base + q + '&crop=entropy', base + q + '&crop=top', base + q + '&crop=bottom'];
};
