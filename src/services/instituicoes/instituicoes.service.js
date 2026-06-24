import { api } from '../api/api'

export const instituicoesService = {
  listar: (params) => api.get('/api/instituicoes', { params }),
  buscarPorId: (id) => api.get(`/api/instituicoes/${id}`),
  criar: (dados) => api.post('/api/instituicoes', dados),
  atualizar: (id, dados) => api.put(`/api/instituicoes/${id}`, dados),
}
