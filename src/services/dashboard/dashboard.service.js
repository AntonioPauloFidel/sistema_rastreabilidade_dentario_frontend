import { api } from '../api/api'

export const dashboardService = {
  resumo: () => api.get('/api/dashboard/resumo'),
  metricas: () => api.get('/api/dashboard/metricas'),
  graficoStatus: () => api.get('/api/dashboard/grafico/status'),
  graficoTipo: () => api.get('/api/dashboard/grafico/tipo'),
  graficoMensal: () => api.get('/api/dashboard/grafico/mensal'),
}
