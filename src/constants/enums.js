export const STATUS_DENTE = {
  RECEBIDO:    { label: 'Recebido',    cor: 'default' },
  EM_TRIAGEM:  { label: 'Em triagem',  cor: 'gold' },
  HIGIENIZADO: { label: 'Higienizado', cor: 'blue' },
  ESTERILIZADO:{ label: 'Esterilizado',cor: 'purple' },
  ARMAZENADO:  { label: 'Armazenado',  cor: 'green' },
  RESERVADO:   { label: 'Reservado',   cor: 'orange' },
  CEDIDO:      { label: 'Cedido',      cor: 'cyan' },
  DESCARTADO:  { label: 'Descartado',  cor: 'red' },
  PERDIDO:     { label: 'Perdido',     cor: 'magenta' },
  DIVERGENTE:  { label: 'Divergente',  cor: 'volcano' },
}

export const TIPO_DENTE = {
  INCISIVO:  { label: 'Incisivo' },
  CANINO:    { label: 'Canino' },
  PRE_MOLAR: { label: 'Pré-molar' },
  MOLAR:     { label: 'Molar' },
  DECIDUO:   { label: 'Decíduo' },
  OUTRO:     { label: 'Outro' },
}

export const CONDICAO_DENTE = {
  INTEGRO:     { label: 'Íntegro' },
  RESTAURADO:  { label: 'Restaurado' },
  CARIADO:     { label: 'Cariado' },
  FRAGMENTADO: { label: 'Fragmentado' },
  OUTRA:       { label: 'Outra' },
}

export const PERFIL_USUARIO = {
  ADMIN:                   { label: 'Administrador',           cor: 'red' },
  BIOBANCO_GESTOR:         { label: 'Gestor de Biobanco',      cor: 'purple' },
  BIOBANCO_OPERADOR:       { label: 'Operador de Biobanco',    cor: 'blue' },
  CLINICA:                 { label: 'Clínica',                 cor: 'cyan' },
  DENTISTA:                { label: 'Dentista',                cor: 'green' },
  INSTITUICAO_SOLICITANTE: { label: 'Instituição Solicitante', cor: 'orange' },
  AUDITOR:                 { label: 'Auditor',                 cor: 'gold' },
}

export const FINALIDADE = {
  ENSINO:          { label: 'Ensino' },
  PESQUISA:        { label: 'Pesquisa' },
  TREINAMENTO:     { label: 'Treinamento' },
  USO_CLINICO:     { label: 'Uso Clínico' },
}

export const STATUS_SOLICITACAO = {
  PENDENTE_ANALISE:      { label: 'Pendente análise',      cor: 'gold' },
  APROVADA:              { label: 'Aprovada',              cor: 'green' },
  RECUSADA:              { label: 'Recusada',              cor: 'red' },
  PARCIALMENTE_ATENDIDA: { label: 'Parcialmente atendida', cor: 'orange' },
  ATENDIDA:              { label: 'Atendida',              cor: 'cyan' },
  CANCELADA:             { label: 'Cancelada',             cor: 'default' },
}

export const STATUS_CESSAO = {
  ATIVA:      { label: 'Ativa',      cor: 'green' },
  ENCERRADA:  { label: 'Encerrada',  cor: 'default' },
  VENCIDA:    { label: 'Vencida',    cor: 'red' },
}

export const TIPO_INSTITUICAO = {
  ESCOLA:       { label: 'Escola' },
  FACULDADE:    { label: 'Faculdade' },
  UNIVERSIDADE: { label: 'Universidade' },
  LABORATORIO:  { label: 'Laboratório' },
  EMPRESA:      { label: 'Empresa' },
  SUS:          { label: 'SUS' },
  OUTRA:        { label: 'Outra' },
}

export function toSelectOptions(enumObj) {
  return Object.entries(enumObj).map(([value, config]) => ({
    value,
    label: typeof config === 'string' ? config : config.label,
  }))
}
