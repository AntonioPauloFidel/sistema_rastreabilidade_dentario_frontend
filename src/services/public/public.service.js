import { api } from '../api/api'

export const publicService = {
  consultaDentes: (cpf) => api.post('/api/public/consulta-dentes', { cpf }),
}
