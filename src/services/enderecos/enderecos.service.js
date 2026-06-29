import { api } from '../api/api'

export const enderecoService = {
  buscarMe: () => api.get('/api/enderecos/me'),
  salvarMe: (dados) => api.put('/api/enderecos/me', dados),
  buscarPorCep: (cep) => api.get(`/api/enderecos/cep/${cep}`),
}
