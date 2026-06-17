
/** Spinner — indicador circular de carregamento em azul da marca. */
export function Spinner({ size = 24, style, ...props }) {
  return (
    <span
      role="status"
      aria-label="Carregando"
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        border: `${Math.max(2, Math.round(size / 12))}px solid var(--color-primary-100)`,
        borderTopColor: 'var(--color-primary-600)',
        borderRadius: 'var(--radius-full)',
        animation: 'spin 0.6s linear infinite',
        ...style,
      }}
      {...props}
    />
  );
}

export default Spinner;
