
/**
 * Input — campo de texto rotulado com suporte a erro + texto auxiliar.
 * Borda 1.5px, foca em azul primário com anel suave.
 * `rightSlot` permite encaixar um elemento à direita dentro do campo
 * (ex.: botão de mostrar/ocultar senha).
 */
export function Input({ label, error, helperText, required, id, style, rightSlot, ...props }) {
  const inputId = id ?? `input-${Math.random().toString(36).slice(2, 7)}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--color-gray-700)' }}
        >
          {label}
          {required && <span style={{ color: 'var(--color-danger)' }}> *</span>}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          id={inputId}
          required={required}
          aria-invalid={!!error}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            paddingRight: rightSlot ? '2.75rem' : '1rem',
            background: 'var(--color-white)',
            border: `1.5px solid ${error ? 'var(--color-danger)' : 'var(--color-gray-300)'}`,
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-gray-900)',
            transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
            ...style,
          }}
          onFocus={(e) => {
            if (!error) {
              e.target.style.borderColor = 'var(--color-primary-500)';
              e.target.style.boxShadow = '0 0 0 3px var(--color-primary-100)';
            }
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? 'var(--color-danger)' : 'var(--color-gray-300)';
            e.target.style.boxShadow = 'none';
          }}
          {...props}
        />
        {rightSlot && (
          <div style={{ position: 'absolute', right: 8, display: 'flex', alignItems: 'center' }}>
            {rightSlot}
          </div>
        )}
      </div>
      {error && (
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-danger)' }} role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>{helperText}</p>
      )}
    </div>
  );
}

export default Input;
