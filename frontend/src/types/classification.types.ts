export type ChaveCampo =
  | "Gender"
  | "Age"
  | "Schooling"
  | "Breastfeeding"
  | "Varicella"
  | "Initial_Symptom"
  | "Mono_or_Polysymptomatic"
  | "Oligoclonal_Bands"
  | "LLSSEP"
  | "ULSSEP"
  | "VEP"
  | "BAEP"
  | "Periventricular_MRI"
  | "Cortical_MRI"
  | "Infratentorial_MRI"
  | "Spinal_Cord_MRI";

export interface DadosTriagem {
  Gender: 1 | 2;
  Age: number;
  Schooling: number;
  Breastfeeding: 1 | 2 | 3;
  Varicella: 1 | 2 | 3;
  Initial_Symptom: number;
  Mono_or_Polysymptomatic: 1 | 2 | 3;
  Oligoclonal_Bands: 0 | 1;
  LLSSEP: 0 | 1;
  ULSSEP: 0 | 1;
  VEP: 0 | 1;
  BAEP: 0 | 1;
  Periventricular_MRI: 0 | 1;
  Cortical_MRI: 0 | 1;
  Infratentorial_MRI: 0 | 1;
  Spinal_Cord_MRI: 0 | 1;
}

export type RespostaCampo = number | "";

export type RespostasTriagem = Partial<Record<ChaveCampo, RespostaCampo>>;

export interface RespostaClassificacao {
  percentual_risco: number;
  erro: boolean;
  mensagem: string;
}

export interface RespostaErroClassificacao {
  erro?: string;
  cold_start?: boolean;
  tentativas?: number;
}

export type NivelRisco = "baixo" | "moderado" | "alto";

export interface ResultadoPrevisao {
  sucesso: boolean;
  percentualRisco?: number;
  nivel?: NivelRisco;
  mensagem?: string;
  erro?: string;
  cold_start?: boolean;
}

export type StatusServicoIA =
  | "verificando"
  | "pronto"
  | "acordando"
  | "indisponivel";