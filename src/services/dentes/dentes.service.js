import { api } from '../api/api'

export const dentesService = {
  listar: (params) => api.get('/api/dentes', { params }),
  buscarPorId: (id) => api.get(`/api/dentes/${id}`),
  criar: (dados) => api.post('/api/dentes', dados),
  alterarStatus: (id, dados) => api.patch(`/api/dentes/${id}/status`, dados),
  movimentacoes: (id) => api.get(`/api/dentes/${id}/movimentacoes`),
  descartar: (id, dados) => api.post(`/api/dentes/${id}/descartar`, dados),
  qrcode: (id) => api.get(`/api/dentes/${id}/qrcode`, { params: { format: 'base64' } }),
}
