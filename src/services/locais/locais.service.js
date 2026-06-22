import { api } from '../api/api'

export const locaisService = {
  listar: (params) => api.get('/api/locais', { params }),
  buscarPorId: (id) => api.get(`/api/locais/${id}`),
  criar: (dados) => api.post('/api/locais', dados),
  atualizar: (id, dados) => api.put(`/api/locais/${id}`, dados),
}
