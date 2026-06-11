import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let renovando = false
let filaEspera = []

api.interceptors.response.use(
  (res) => res,
  async (erro) => {
    const original = erro.config

    if (erro.response?.status === 401 && !original._retry) {
      if (renovando) {
        return new Promise((resolve, reject) => {
          filaEspera.push({ resolve, reject })
        }).then(() => api(original))
      }

      original._retry = true
      renovando = true

      try {
        await api.post('/api/auth/refresh')
        filaEspera.forEach(({ resolve }) => resolve())
        filaEspera = []
        return api(original)
      } catch {
        filaEspera.forEach(({ reject }) => reject())
        filaEspera = []
        localStorage.removeItem('token')
        window.location.href = '/login'
        return Promise.reject(erro)
      } finally {
        renovando = false
      }
    }

    return Promise.reject(erro)
  }
)
