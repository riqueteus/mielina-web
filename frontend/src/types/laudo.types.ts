export interface IdentificacaoProtocolo {
  data_exame: string | null
  tipo_exame: string | null
  regiao_examinada: string | null
  indicacao_clinica: string | null
  tecnica: string | null
}

export interface AtividadeInflamatoria {
  realce_gadolinio: boolean | null
  quantidade_lesoes_com_realce: number | null
  padrao_realce: string | null
  evidencia: string | null
}

export interface BiomarcadoresAvancados {
  sinal_veia_central: boolean | null
  lesoes_anel_paramagnetico_prl: boolean | null
  evidencia: string | null
}

export interface AtrofiaAchadosCronicos {
  atrofia_encefalica: boolean | null
  buracos_negros_t1: boolean | null
  evidencia: string | null
}

export interface Lesao {
  id?: string
  localizacao: string | null
  regiao: string | null
  caracteristica: string | null
  evidencia: string | null
  tamanho_mm: number | null
  realce_contraste: boolean | null
}

export interface Conclusao {
  texto: string | null
  evidencia: string | null
}

export interface Laudo {
  id: string
  data_exame: string | null
  tipo_exame: string | null
  regiao_examinada: string | null
  indicacao_clinica: string | null
  tecnica: string | null
  atividade_inflamatoria: AtividadeInflamatoria | null
  biomarcadores_avancados: BiomarcadoresAvancados | null
  atrofia_achados_cronicos: AtrofiaAchadosCronicos | null
  conclusao: Conclusao | null
  pdf_url: string | null
  pdf_nome: string | null
  criado_em: string
  quantidade_lesoes: number
  lesoes?: Lesao[]
  pdf_url_assinado?: string | null
}

export interface PontoEvolucaoLesoes {
  data_exame: string
  quantidade_lesoes: number
}

export interface DistribuicaoRegiao {
  regiao: string
  quantidade: number
}

export type ResultadoEnvioLaudo =
  | { sucesso: true; laudo: Laudo }
  | { sucesso: false; erro: string }