import { z } from 'zod'

export const formularioDenteSchema = z.object({
  codigoRastreio: z
    .string()
    .min(3, 'Código de rastreio deve ter no mínimo 3 caracteres')
    .max(50, 'Código de rastreio deve ter no máximo 50 caracteres'),
  
  tipo: z
    .string()
    .min(1, 'Tipo de dente é obrigatório')
    .refine(
      (val) => ['INCISIVO', 'CANINO', 'PRE_MOLAR', 'MOLAR', 'DECIDUO', 'OUTRO'].includes(val),
      'Tipo de dente inválido'
    ),
  
  numeracaoDental: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d+$/.test(val),
      'Numeração dental deve conter apenas números'
    ),
  
  condicao: z
    .string()
    .min(1, 'Condição é obrigatória')
    .refine(
      (val) => ['INTEGRO', 'RESTAURADO', 'CARIADO', 'FRAGMENTADO', 'OUTRA'].includes(val),
      'Condição inválida'
    ),
  
  doadorId: z
    .string()
    .uuid('ID do doador inválido')
    .min(1, 'Doador é obrigatório'),
  
  remessaId: z
    .string()
    .uuid('ID da remessa inválido')
    .min(1, 'Remessa de entrada é obrigatória'),
  
  localAtualId: z
    .string()
    .uuid('ID do local inválido')
    .min(1, 'Local de armazenamento é obrigatório'),
  
  observacao: z
    .string()
    .max(500, 'Observação deve ter no máximo 500 caracteres')
    .optional()
    .or(z.literal('')),
})
