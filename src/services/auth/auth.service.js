import { api } from '../api/api'

export const authService = {
  login: (dados) => api.post('/api/auth/login', dados),
  logout: () => api.post('/api/auth/logout'),
  refresh: () => api.post('/api/auth/refresh'),
  me: () => api.get('/api/auth/me'),
  atualizarPerfil: (dados) => api.patch('/api/auth/me', dados),
  alterarSenha: (dados) => api.patch('/api/auth/senha', dados),
}
