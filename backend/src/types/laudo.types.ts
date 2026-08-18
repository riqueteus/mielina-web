export interface IdentificacaoProtocolo {
  data_exame: string | null;
  tipo_exame: string | null;
  regiao_examinada: string | null;
  indicacao_clinica: string | null;
  tecnica: string | null;
}

export interface AtividadeInflamatoria {
  realce_gadolinio: boolean | null;
  quantidade_lesoes_com_realce: number | null;
  padrao_realce: string | null;
  evidencia: string | null;
}

export interface BiomarcadoresAvancados {
  sinal_veia_central: boolean | null;
  lesoes_anel_paramagnetico_prl: boolean | null;
  evidencia: string | null;
}

export interface AtrofiaAchadosCronicos {
  atrofia_encefalica: boolean | null;
  buracos_negros_t1: boolean | null;
  evidencia: string | null;
}

export interface Lesao {
  localizacao: string | null;
  regiao: string | null;
  tamanho_mm: number | null;
  caracteristica: string | null;
  realce_contraste: boolean | null;
  evidencia: string | null;
}

export interface Conclusao {
  texto: string | null;
  evidencia: string | null;
}

export interface LaudoEstruturado {
  identificacao_protocolo: IdentificacaoProtocolo;
  atividade_inflamatoria: AtividadeInflamatoria;
  biomarcadores_avancados: BiomarcadoresAvancados;
  atrofia_achados_cronicos: AtrofiaAchadosCronicos;
  lesoes: Lesao[];
  conclusao: Conclusao;
}

export interface RespostaExtrairLaudo {
  resultado: LaudoEstruturado;
}

export type RegiaoCanonica =
  | 'periventricular'
  | 'justacortical'
  | 'infratentorial'
  | 'medular'
  | 'outra';

export interface LesaoNormalizada extends Lesao {
  regiao_canonica: RegiaoCanonica;
}

export interface LaudoListado {
  id: string;
  data_exame: string;
  tipo_exame: string | null;
  regiao_examinada: string | null;
  indicacao_clinica: string | null;
  tecnica: string | null;
  atividade_inflamatoria: AtividadeInflamatoria | null;
  biomarcadores_avancados: BiomarcadoresAvancados | null;
  atrofia_achados_cronicos: AtrofiaAchadosCronicos | null;
  conclusao: Conclusao | null;
  pdf_url: string | null;
  pdf_nome: string | null;
  criado_em: string;
  quantidade_lesoes: number;
  pdf_url_assinado?: string | null;
}

export interface PontoEvolucaoLesoes {
  data_exame: string;
  quantidade_lesoes: number;
}

export interface DistribuicaoRegiao {
  regiao: string;
  quantidade: number;
}
