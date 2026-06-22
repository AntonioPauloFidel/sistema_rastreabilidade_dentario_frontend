import { api } from '../api/api'

export const dentesService = {
  listar: (params) => api.get('/api/dentes', { params }),
  buscarPorId: (id) => api.get(`/api/dentes/${id}`),
  criar: (dados) => api.post('/api/dentes', dados),
  alterarStatus: (id, status) => api.patch(`/api/dentes/${id}/status`, { status }),
  historico: (id) => api.get(`/api/dentes/${id}/historico`),
  fotos: (id) => api.get(`/api/dentes/${id}/fotos`),
}
