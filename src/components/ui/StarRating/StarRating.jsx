// src/components/ui/StarRating/StarRating.jsx
import { Star } from 'lucide-react'
import styles from './StarRating.module.css'

function StarRating({ rating = 0, count, size = 14 }) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = i < Math.floor(rating)
    const half = !filled && i < rating
    return { filled, half }
  })

  return (
    <div className={styles.wrapper}>
      <div className={styles.stars} aria-label={`Avaliação: ${rating} de 5`}>
        {stars.map(({ filled, half }, i) => (
          <Star
            key={i}
            size={size}
            className={`${styles.star} ${filled ? styles.filled : ''} ${half ? styles.half : ''}`}
            aria-hidden="true"
          />
        ))}
      </div>
      {count !== undefined && (
        <span className={styles.count}>({count})</span>
      )}
    </div>
  )
}

export default StarRating
