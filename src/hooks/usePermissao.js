import { useMemo } from 'react'
import { useAuth } from '../contexts/AuthContext'

function normalizarPerfis(perfis) {
  if (!perfis) return []

  if (Array.isArray(perfis)) {
    return perfis
      .filter(Boolean)
      .map((perfil) => String(perfil).trim().toUpperCase())
  }

  if (typeof perfis === 'string') {
    return perfis
      .split(',')
      .map((perfil) => perfil.trim().toUpperCase())
      .filter(Boolean)
  }

  return []
}

export function usePermissao() {
  const { usuario } = useAuth()

  const perfis = useMemo(() => {
    const perfisBrutos = usuario?.perfil ?? usuario?.perfis ?? usuario?.roles ?? []
    return normalizarPerfis(perfisBrutos)
  }, [usuario])

  const pode = (...perfisNecessarios) => {
    if (!perfisNecessarios || perfisNecessarios.length === 0) return true

    const perfisRequeridos = perfisNecessarios
      .flatMap((perfil) => {
        if (Array.isArray(perfil)) return perfil
        return [perfil]
      })
      .map((perfil) => String(perfil).trim().toUpperCase())
      .filter(Boolean)

    if (!perfisRequeridos.length) return true

    const perfisUsuarioSet = new Set(perfis)
    return perfisRequeridos.some((perfil) => perfisUsuarioSet.has(perfil))
  }

  const perfil = perfis[0] ?? null
  const eAdmin = pode('ADMIN')
  const eGestor = pode('ADMIN', 'BIOBANCO_GESTOR')
  const eOperador = pode('ADMIN', 'BIOBANCO_GESTOR', 'BIOBANCO_OPERADOR')
  const eInstituicao = pode('INSTITUICAO_SOLICITANTE')

  return { pode, perfil, perfis, eAdmin, eGestor, eOperador, eInstituicao }
}

export default usePermissao
