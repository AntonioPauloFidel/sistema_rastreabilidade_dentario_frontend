import { useCallback, useEffect, useMemo, useState } from 'react'

export function usePaginacao({ paginaInicial = 1, limiteInicial = 10, totalInicial = 0 } = {}) {
  const [pagina, setPagina] = useState(paginaInicial)
  const [limite, setLimite] = useState(limiteInicial)
  const [total, setTotal] = useState(totalInicial)

  const totalPaginas = useMemo(() => Math.max(1, Math.ceil(total / limite)), [total, limite])

  useEffect(() => {
    if (pagina > totalPaginas) {
      setPagina(totalPaginas)
    }
  }, [pagina, totalPaginas])

  const irParaPagina = useCallback(
    (numero) => {
      const proxima = Math.max(1, Math.min(numero, totalPaginas))
      setPagina(proxima)
    },
    [totalPaginas]
  )

  const proximaPagina = useCallback(() => irParaPagina(pagina + 1), [irParaPagina, pagina])
  const paginaAnterior = useCallback(() => irParaPagina(pagina - 1), [irParaPagina, pagina])

  return {
    pagina,
    limite,
    total,
    totalPaginas,
    irParaPagina,
    proximaPagina,
    paginaAnterior,
    setLimite,
    setTotal,
  }
}
