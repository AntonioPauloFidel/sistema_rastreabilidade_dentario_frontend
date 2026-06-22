import { api } from '../api/api'

export const usuariosService = {
  listar: (params) => api.get('/api/usuarios', { params }),
  buscarPorId: (id) => api.get(`/api/usuarios/${id}`),
  criar: (dados) => api.post('/api/usuarios', dados),
  alterarPerfil: (id, perfil) => api.patch(`/api/usuarios/${id}/perfil`, { perfil }),
  alterarStatus: (id, ativo) => api.patch(`/api/usuarios/${id}/status`, { ativo }),
}
