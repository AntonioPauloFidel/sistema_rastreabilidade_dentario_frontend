import { useEffect, useState } from 'react'

export function useDebounce(valor, delay = 300) {
  const [valorDebounced, setValorDebounced] = useState(valor)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setValorDebounced(valor)
    }, delay)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [valor, delay])

  return valorDebounced
}
