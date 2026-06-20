import { useState } from 'react';

const STAR_PATH =
  'M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z';

// Estrela individual (preenchida = âmbar quente; vazia = gray-300).
function Star({ filled, size }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? '#f6ad55' : 'var(--color-gray-300)'}
      stroke={filled ? '#f6ad55' : 'var(--color-gray-300)'}
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d={STAR_PATH} />
    </svg>
  );
}

/**
 * StarRating — 5 estrelas para avaliações de produto.
 *
 * - **Exibição (padrão):** mostra `rating` (com `count` opcional).
 * - **Seletor (interativo):** passe `onRate(nota)` para o usuário escolher de
 *   1 a 5 estrelas (com destaque no hover). Usado na avaliação pós-compra.
 */
export function StarRating({ rating = 0, count, size = 14, onRate, style, ...props }) {
  const [hover, setHover] = useState(0);
  const interactive = typeof onRate === 'function';

  // No modo seletor, o hover prevalece sobre a nota já escolhida.
  const shown = interactive && hover ? hover : rating;
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(shown));

  if (interactive) {
    return (
      <div
        role="radiogroup"
        aria-label="Selecione uma nota de 1 a 5 estrelas"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 2, ...style }}
        {...props}
      >
        {stars.map((filled, i) => (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={rating === i + 1}
            aria-label={`${i + 1} ${i + 1 === 1 ? 'estrela' : 'estrelas'}`}
            onClick={() => onRate(i + 1)}
            onMouseEnter={() => setHover(i + 1)}
            onMouseLeave={() => setHover(0)}
            style={{ background: 'none', border: 'none', padding: 2, cursor: 'pointer', display: 'flex', lineHeight: 0 }}
          >
            <Star filled={filled} size={size} />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', ...style }}
      aria-label={`Avaliação: ${rating} de 5`}
      {...props}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {stars.map((filled, i) => (
          <Star key={i} filled={filled} size={size} />
        ))}
      </div>
      {count !== undefined && (
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>({count})</span>
      )}
    </div>
  );
}

export default StarRating;
