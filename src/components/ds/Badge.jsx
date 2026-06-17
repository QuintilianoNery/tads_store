
/**
 * Badge — pequeno rótulo de status / categoria em maiúsculas.
 * Manrope, tracking apertado, fundo levemente tingido.
 */
export function Badge({ variant = 'primary', size = 'md', children, style, ...props }) {
  const sizes = {
    sm: { padding: '2px 0.5rem', fontSize: '0.625rem' },
    md: { padding: '0.25rem 0.75rem', fontSize: 'var(--text-xs)' },
  };

  const variants = {
    primary: { background: 'var(--color-primary-100)', color: 'var(--color-primary-800)' },
    accent: { background: 'var(--color-primary-50)', color: 'var(--color-accent)' },
    deal: { background: 'var(--color-deal-soft)', color: 'var(--color-deal-text)' },
    success: { background: '#dcfce7', color: '#15803d' },
    danger: { background: '#fee2e2', color: '#b91c1c' },
    warning: { background: '#fef3c7', color: '#b45309' },
    info: { background: '#dbeafe', color: '#1d4ed8' },
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 'var(--font-bold)',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        borderRadius: 'var(--radius-sm)',
        lineHeight: 1,
        ...sizes[size],
        ...variants[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;
