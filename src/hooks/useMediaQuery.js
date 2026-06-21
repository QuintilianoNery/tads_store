// src/hooks/useMediaQuery.js
// Responsividade para uma base feita com estilos inline: como inline style não
// aceita media query, os componentes leem estes hooks (baseados em
// window.matchMedia) e trocam o layout em JS. Mantemos os breakpoints num só
// lugar para a loja ter um comportamento consistente em todas as telas.
import { useState, useEffect } from 'react';

// Breakpoints (px) — espelham os limites usados nas media queries do global.css.
export const BREAKPOINTS = {
  mobile: 768, // < 768px  → celular (uma coluna, menu hambúrguer)
  tablet: 1024, // < 1024px → tablet (colapsa as barras laterais)
};

// Assina uma media query e retorna se ela casa no momento. SSR-safe (assume
// "não casa" quando window/matchMedia não existem, ex.: testes em node).
export function useMediaQuery(query) {
  const getMatches = () =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia(query).matches
      : false;

  const [matches, setMatches] = useState(getMatches);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange(); // sincroniza caso a query tenha mudado entre o render e o efeito
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

// Celular: layout em uma coluna, menu em gaveta.
export const useIsMobile = () => useMediaQuery(`(max-width: ${BREAKPOINTS.mobile - 1}px)`);

// Tablet ou menor: colapsa layouts de duas colunas (conteúdo + barra lateral).
export const useIsTablet = () => useMediaQuery(`(max-width: ${BREAKPOINTS.tablet - 1}px)`);

// Ponteiro grosso (toque) ou tela pequena: usado para revelar ações que, no
// desktop, só aparecem no hover (que não existe no toque).
export const useIsTouch = () =>
  useMediaQuery(`(hover: none), (pointer: coarse), (max-width: ${BREAKPOINTS.mobile - 1}px)`);
