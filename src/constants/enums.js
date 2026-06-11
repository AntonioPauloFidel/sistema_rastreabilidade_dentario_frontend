export const STATUS_DENTE = {
  RECEBIDO:    { label: 'Recebido',    cor: 'default' },
  EM_TRIAGEM:  { label: 'Em triagem',  cor: 'gold' },
  HIGIENIZADO: { label: 'Higienizado', cor: 'blue' },
  ARMAZENADO:  { label: 'Armazenado', cor: 'green' },
  RESERVADO:   { label: 'Reservado',  cor: 'purple' },
  CEDIDO:      { label: 'Cedido',      cor: 'cyan' },
  DESCARTADO:  { label: 'Descartado', cor: 'red' },
}

export const TIPO_DENTE = {
  INCISIVO_CENTRAL: { label: 'Incisivo Central' },
  INCISIVO_LATERAL: { label: 'Incisivo Lateral' },
  CANINO:           { label: 'Canino' },
  PRE_MOLAR:        { label: 'Pré-molar' },
  MOLAR:            { label: 'Molar' },
  SISO:             { label: 'Siso' },
}

export const PERFIL_USUARIO = {
  ADMIN:               { label: 'Administrador' },
  BIOBANCO_OPERADOR:   { label: 'Operador de Biobanco' },
  BIOBANCO_GESTOR:     { label: 'Gestor de Biobanco' },
  SOLICITANTE:         { label: 'Solicitante' },
}

export const FINALIDADE = {
  ENSINO:          { label: 'Ensino' },
  PESQUISA:        { label: 'Pesquisa' },
  TREINAMENTO:     { label: 'Treinamento' },
  USO_CLINICO:     { label: 'Uso Clínico' },
}

export const STATUS_SOLICITACAO = {
  PENDENTE:   { label: 'Pendente',   cor: 'gold' },
  APROVADA:   { label: 'Aprovada',   cor: 'green' },
  RECUSADA:   { label: 'Recusada',   cor: 'red' },
  CANCELADA:  { label: 'Cancelada',  cor: 'default' },
  EM_ANALISE: { label: 'Em análise', cor: 'blue' },
}

export const STATUS_CESSAO = {
  ATIVA:      { label: 'Ativa',      cor: 'green' },
  ENCERRADA:  { label: 'Encerrada',  cor: 'default' },
  VENCIDA:    { label: 'Vencida',    cor: 'red' },
}

export function toSelectOptions(enumObj) {
  return Object.entries(enumObj).map(([value, config]) => ({
    value,
    label: typeof config === 'string' ? config : config.label,
  }))
}
