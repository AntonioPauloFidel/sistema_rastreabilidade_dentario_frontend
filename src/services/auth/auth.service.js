import { api } from '../api/api'

const montarPayloadLogin = (dados = {}) => ({
  email: dados.email,
  senha: dados.senha,
  password: dados.password ?? dados.senha,
  username: dados.username ?? dados.email,
})

export const authService = {
  login: (dados) => api.post('/api/auth/login', montarPayloadLogin(dados)),
  logout: () => api.post('/api/auth/logout'),
  refresh: () => api.post('/api/auth/refresh'),
  me: () => api.get('/api/auth/me'),
  atualizarPerfil: (dados) => api.patch('/api/auth/me', dados),
  alterarSenha: (dados) => api.patch('/api/auth/senha', dados),
}
