
/**
 * Button — controle de ação primária da TADS Store.
 * Manrope, borda 2px, cantos arredondados (radius-md).
 */
export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  children,
  style,
  disabled,
  ...props
}) {
  const sizes = {
    sm: { padding: '0.5rem 1rem', fontSize: 'var(--text-sm)' },
    md: { padding: '0.75rem 1.5rem', fontSize: 'var(--text-base)' },
    lg: { padding: '1rem 2rem', fontSize: 'var(--text-lg)' },
  };

  const variants = {
    primary: { background: 'var(--color-primary-800)', color: 'var(--color-white)', borderColor: 'var(--color-primary-800)' },
    secondary: { background: 'transparent', color: 'var(--color-primary-800)', borderColor: 'var(--color-primary-800)' },
    accent: { background: 'var(--color-accent)', color: 'var(--color-white)', borderColor: 'var(--color-accent)' },
    deal: { background: 'var(--color-deal)', color: 'var(--color-gray-900)', borderColor: 'var(--color-deal)' },
    ghost: { background: 'transparent', color: 'var(--color-gray-700)', borderColor: 'transparent' },
    danger: { background: 'var(--color-danger)', color: 'var(--color-white)', borderColor: 'var(--color-danger)' },
  };

  const isDisabled = isLoading || disabled;

  return (
    <button
      disabled={isDisabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-2)',
        fontFamily: 'var(--font-display)',
        fontWeight: 'var(--font-bold)',
        borderRadius: 'var(--radius-md)',
        border: '2px solid transparent',
        lineHeight: 1,
        letterSpacing: '0.01em',
        whiteSpace: 'nowrap',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.5 : 1,
        transition: 'all var(--transition-fast)',
        width: fullWidth ? '100%' : undefined,
        ...sizes[size],
        ...variants[variant],
        ...style,
      }}
      {...props}
    >
      {isLoading && (
        <span
          aria-hidden="true"
          style={{
            width: '1em',
            height: '1em',
            border: '2px solid transparent',
            borderTopColor: 'currentColor',
            borderRadius: 'var(--radius-full)',
            animation: 'spin 0.6s linear infinite',
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </button>
  );
}

export default Button;
