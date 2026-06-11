// src/hooks/useFetch.js
// Hook genérico para busca de dados com estados loading/error/data
import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Hook genérico para chamadas assíncronas.
 * @param {Function} fetchFn   - Função assíncrona que retorna os dados
 * @param {Array}    deps      - Dependências (re-executa quando mudam)
 * @param {boolean}  immediate - Executa imediatamente ao montar (padrão: true)
 *
 * @returns {{ data, isLoading, error, refetch }}
 */
export function useFetch(fetchFn, deps = [], immediate = true) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(immediate)
  const [error, setError] = useState(null)

  // Ref para evitar atualização de estado em componente desmontado
  const isMountedRef = useRef(true)

  const execute = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await fetchFn()
      if (isMountedRef.current) {
        setData(result)
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err.message ?? 'Erro ao carregar dados.')
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    isMountedRef.current = true
    if (immediate) execute()
    return () => {
      isMountedRef.current = false
    }
  }, [execute, immediate])

  return { data, isLoading, error, refetch: execute }
}

export default useFetch
