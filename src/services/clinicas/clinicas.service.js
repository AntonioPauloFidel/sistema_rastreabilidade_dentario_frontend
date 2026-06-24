import { api } from '../api/api'

export const clinicasService = {
  listar: (params) => api.get('/api/clinicas', { params }),
  buscarPorId: (id) => api.get(`/api/clinicas/${id}`),
  criar: (dados) => api.post('/api/clinicas', dados),
  atualizar: (id, dados) => api.put(`/api/clinicas/${id}`, dados),
}
