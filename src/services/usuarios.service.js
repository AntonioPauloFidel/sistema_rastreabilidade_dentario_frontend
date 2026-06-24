import { api } from './api'

export const usuariosService = {
  listar: (params) => api.get('/api/usuarios', { params }),
  buscarPorId: (id) => api.get(`/api/usuarios/${id}`),
  criar: (dados) => api.post('/api/usuarios', dados),
  atualizar: (id, dados) => api.put(`/api/usuarios/${id}`, dados),
  alterarPerfil: (id, perfil) => api.patch(`/api/usuarios/${id}/perfil`, { perfil }),
  ativar: (id) => api.patch(`/api/usuarios/${id}/ativar`),
  desativar: (id) => api.patch(`/api/usuarios/${id}/desativar`),
}
