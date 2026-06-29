import { useCallback, useEffect, useRef, useState } from 'react'

export function useFetch(request, dependencias = []) {
  const [dados, setDados] = useState(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)
  const abortControllerRef = useRef(null)

  const refetch = useCallback(
    async (...args) => {
      abortControllerRef.current?.abort()
      const controller = new AbortController()
      abortControllerRef.current = controller

      setCarregando(true)
      setErro(null)

      try {
        const resposta = await request({ signal: controller.signal }, ...args)
        setDados(resposta?.data ?? resposta)
        return resposta
      } catch (erroCapturado) {
        if (erroCapturado?.name !== 'CanceledError' && erroCapturado?.name !== 'AbortError' && erroCapturado?.code !== 'ERR_CANCELED') {
          setErro(erroCapturado)
        }
        throw erroCapturado
      } finally {
        setCarregando(false)
      }
    },
    [request, ...dependencias]
  )

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  useEffect(() => {
    if (typeof request === 'function') {
      refetch()
    }
  }, [refetch])

  return {
    dados,
    carregando,
    erro,
    refetch,
  }
}
