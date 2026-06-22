import { api } from '../api/api'

export const remessasService = {
  listar: (params) => api.get('/api/remessas-entrada', { params }),
  buscarPorId: (id) => api.get(`/api/remessas-entrada/${id}`),
  criar: (dados) => api.post('/api/remessas-entrada', dados),
  atualizar: (id, dados) => api.put(`/api/remessas-entrada/${id}`, dados),
}
