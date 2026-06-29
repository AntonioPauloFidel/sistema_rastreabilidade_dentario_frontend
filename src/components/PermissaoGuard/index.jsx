import { usePermissao } from '../../hooks/usePermissao'

export function PermissaoGuard({
  perfis = [],
  children,
  fallback = null,
}) {
  const { pode } = usePermissao()

  if (!pode(perfis)) {
    return fallback
  }

  return children
}

export default PermissaoGuard
