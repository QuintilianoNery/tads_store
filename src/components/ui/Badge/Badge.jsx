// src/components/ui/Badge/Badge.jsx
import styles from './Badge.module.css'

/**
 * Badge/Selo genérico reutilizável.
 * @param {'success'|'danger'|'warning'|'info'|'primary'} variant
 * @param {'sm'|'md'} size
 */
function Badge({ children, variant = 'primary', size = 'md', className = '' }) {
  const classes = [styles.badge, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(' ')

  return <span className={classes}>{children}</span>
}

export default Badge
