// src/components/ui/Button/Button.jsx
import styles from './Button.module.css'

/**
 * Botão genérico reutilizável.
 *
 * @param {'primary'|'secondary'|'accent'|'ghost'|'danger'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} fullWidth
 * @param {boolean} isLoading
 * @param {React.ReactNode} children
 * @param {React.ButtonHTMLAttributes} props - Todos os atributos nativos de <button>
 */
function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  children,
  className = '',
  ...props
}) {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.full : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} disabled={isLoading || props.disabled} {...props}>
      {isLoading && <span className={styles.spinner} aria-hidden="true" />}
      {children}
    </button>
  )
}

export default Button
