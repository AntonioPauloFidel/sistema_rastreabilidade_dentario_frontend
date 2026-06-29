import { useCallback, useRef, useState } from 'react'

export function useConfirmacao() {
  const [aberto, setAberto] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [titulo, setTitulo] = useState('Confirmação')
  const resolveRef = useRef(null)

  const confirmar = useCallback((mensagemConfirmacao, tituloConfirmacao = 'Confirmação') => {
    return new Promise((resolve, reject) => {
      if (aberto) {
        reject(new Error('Já existe uma confirmação aberta.'))
        return
      }

      resolveRef.current = resolve
      setMensagem(mensagemConfirmacao)
      setTitulo(tituloConfirmacao)
      setAberto(true)
    })
  }, [aberto])

  const onConfirmar = useCallback(() => {
    setAberto(false)
    resolveRef.current?.(true)
    resolveRef.current = null
  }, [])

  const onCancelar = useCallback(() => {
    setAberto(false)
    resolveRef.current?.(false)
    resolveRef.current = null
  }, [])

  return {
    confirmar,
    aberto,
    mensagem,
    titulo,
    onConfirmar,
    onCancelar,
  }
}
