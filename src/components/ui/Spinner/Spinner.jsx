// src/components/ui/Spinner/Spinner.jsx
import styles from './Spinner.module.css'

function Spinner({ size = 'md', message = 'Carregando...' }) {
  return (
    <div className={styles.wrapper} role="status" aria-label={message}>
      <div className={`${styles.spinner} ${styles[size]}`} />
      {message && <p className={styles.message}>{message}</p>}
    </div>
  )
}

export default Spinner
