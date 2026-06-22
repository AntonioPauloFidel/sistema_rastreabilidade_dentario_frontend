import { api } from '../api/api'

export const auditoriaService = {
  listar: (params) => api.get('/api/auditoria', { params }),
}
