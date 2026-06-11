// src/components/ui/Input/Input.jsx
import { forwardRef } from 'react'
import styles from './Input.module.css'

/**
 * Input genérico com label, erro e ícone opcional.
 * Usa forwardRef para suporte a react-hook-form e afins.
 */
const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    className = '',
    id,
    required,
    ...props
  },
  ref
) {
  const inputId = id ?? `input-${Math.random().toString(36).slice(2, 7)}`

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required} aria-hidden="true"> *</span>}
        </label>
      )}
      <div className={`${styles.inputWrapper} ${error ? styles.hasError : ''}`}>
        {LeftIcon && (
          <span className={styles.iconLeft} aria-hidden="true">
            <LeftIcon size={16} />
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`${styles.input} ${LeftIcon ? styles.withLeftIcon : ''} ${RightIcon ? styles.withRightIcon : ''} ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          required={required}
          {...props}
        />
        {RightIcon && (
          <span className={styles.iconRight} aria-hidden="true">
            <RightIcon size={16} />
          </span>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className={styles.errorText} role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className={styles.helperText}>{helperText}</p>
      )}
    </div>
  )
})

export default Input
