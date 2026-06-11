import { api } from './api'

export const doadoresService = {
  listar: (params) => api.get('/api/doadores', { params }),
  buscarPorId: (id) => api.get(`/api/doadores/${id}`),
  buscarPorCpf: (cpf) => api.get(`/api/doadores/cpf/${cpf}`),
  criar: (dados) => api.post('/api/doadores', dados),
  atualizar: (id, dados) => api.put(`/api/doadores/${id}`, dados),
}
