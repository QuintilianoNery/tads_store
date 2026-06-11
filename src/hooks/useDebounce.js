// src/hooks/useDebounce.js
// Atrasa a atualização de um valor — ideal para campos de busca
import { useState, useEffect } from 'react'

/**
 * @param {*}      value - Valor a ser "debounced"
 * @param {number} delay - Delay em ms (padrão: 400)
 * @returns O valor atualizado apenas após o delay
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
