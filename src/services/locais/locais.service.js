import { api } from '../api/api'

export const locaisService = {
  listar: (params) => api.get('/api/locais-armazenamento', { params }),
  buscarPorId: (id) => api.get(`/api/locais-armazenamento/${id}`),
  criar: (dados) => api.post('/api/locais-armazenamento', dados),
  atualizar: (id, dados) => api.put(`/api/locais-armazenamento/${id}`, dados),
}
