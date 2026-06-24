import { api } from '../api/api'

export const cessoesService = {
  listar: (params) => api.get('/api/cessoes', { params }),
  buscarPorId: (id) => api.get(`/api/cessoes/${id}`),
  criar: (dados) => api.post('/api/cessoes', dados),
  encerrar: (id) => api.patch(`/api/cessoes/${id}/encerrar`),
}
