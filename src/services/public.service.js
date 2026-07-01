import { api } from './api/api'

export const publicService = {
  solicitarCodigo: (cpf) => api.post('/api/public/solicitar-codigo', { cpf }),
  confirmarCodigo: (cpf, codigo) => api.post('/api/public/confirmar-codigo', { cpf, codigo }),
  consultaDentes: (cpf) => api.post('/api/public/consulta-dentes', { cpf }),
}
