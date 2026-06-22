import { api } from '../api/api'

export const authService = {
  login: (dados) => api.post('/api/auth/login', dados),
  logout: () => api.post('/api/auth/logout'),
  refresh: () => api.post('/api/auth/refresh'),
  me: () => api.get('/api/auth/me'),
  alterarSenha: (dados) => api.put('/api/auth/senha', dados),
}
