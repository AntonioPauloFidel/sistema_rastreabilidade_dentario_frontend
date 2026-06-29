import { z } from 'zod'

export const formularioCessaoSchema = z.object({
  solicitacaoId: z
    .string()
    .uuid('ID da solicitação inválido')
    .min(1, 'Solicitação é obrigatória'),
  
  denteId: z
    .string()
    .uuid('ID do dente inválido')
    .min(1, 'Dente é obrigatório'),
  
  dataCessao: z
    .date()
    .min(new Date('2020-01-01'), 'Data deve ser válida')
    .max(new Date(), 'Data não pode ser no futuro'),
  
  observacao: z
    .string()
    .max(500, 'Observação deve ter no máximo 500 caracteres')
    .optional()
    .or(z.literal('')),
})
