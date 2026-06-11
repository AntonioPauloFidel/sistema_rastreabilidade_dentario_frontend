import { api } from './api'

export const solicitacoesService = {
  listar: (params) => api.get('/api/solicitacoes', { params }),
  buscarPorId: (id) => api.get(`/api/solicitacoes/${id}`),
  criar: (dados) => api.post('/api/solicitacoes', dados),
  aprovar: (id, dados) => api.patch(`/api/solicitacoes/${id}/aprovar`, dados),
  recusar: (id, motivo) => api.patch(`/api/solicitacoes/${id}/recusar`, { motivo }),
  cancelar: (id) => api.patch(`/api/solicitacoes/${id}/cancelar`),
}
