import { api } from '../api/api'

export const dashboardService = {
  metricas: () => api.get('/api/dashboard/metricas'),
  graficoStatus: () => api.get('/api/dashboard/grafico/status'),
  graficoMensal: () => api.get('/api/dashboard/grafico/mensal'),
}
