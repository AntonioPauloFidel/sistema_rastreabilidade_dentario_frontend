import { api } from './api'

export const dentistasService = {
  listar: (params) => api.get('/api/dentistas', { params }),
  buscarPorId: (id) => api.get(`/api/dentistas/${id}`),
  criar: (dados) => api.post('/api/dentistas', dados),
  atualizar: (id, dados) => api.put(`/api/dentistas/${id}`, dados),
}
