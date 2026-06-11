import { api } from './api'

export const remessasService = {
  listar: (params) => api.get('/api/remessas', { params }),
  buscarPorId: (id) => api.get(`/api/remessas/${id}`),
  criar: (dados) => api.post('/api/remessas', dados),
  atualizar: (id, dados) => api.put(`/api/remessas/${id}`, dados),
}
