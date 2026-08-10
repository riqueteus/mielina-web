import { LIMIARES_RISCO } from "../config/classification.config";
import type {
  ChaveCampo,
  DadosTriagem,
  NivelRisco,
  RespostasTriagem,
} from "../types/classification.types";

export function normalizarPercentualRisco(valor: number): number {
  if (typeof valor !== "number" || Number.isNaN(valor)) return 0;

  let percentual = Math.abs(valor);

  if (percentual <= 1) {
    percentual = percentual * 100;
  }

  return Math.min(100, Math.max(0, Math.round(percentual)));
}

export function definirNivelRisco(percentual: number): NivelRisco {
  if (percentual >= LIMIARES_RISCO.alto) return "alto";
  if (percentual >= LIMIARES_RISCO.moderado) return "moderado";
  return "baixo";
}

export function montarPayload(respostas: RespostasTriagem): DadosTriagem | null {
  if (!campoRespondido(respostas, "Gender")) return null;

  return {
    Gender: respostas.Gender as 1 | 2,
    Age: respostas.Age as number,
    Schooling: respostas.Schooling as number,
    Breastfeeding: respostas.Breastfeeding as 1 | 2 | 3,
    Varicella: respostas.Varicella as 1 | 2 | 3,
    Initial_Symptom: respostas.Initial_Symptom as number,
    Mono_or_Polysymptomatic: respostas.Mono_or_Polysymptomatic as 1 | 2 | 3,
    Oligoclonal_Bands: respostas.Oligoclonal_Bands as 0 | 1,
    LLSSEP: respostas.LLSSEP as 0 | 1,
    ULSSEP: respostas.ULSSEP as 0 | 1,
    VEP: respostas.VEP as 0 | 1,
    BAEP: respostas.BAEP as 0 | 1,
    Periventricular_MRI: respostas.Periventricular_MRI as 0 | 1,
    Cortical_MRI: respostas.Cortical_MRI as 0 | 1,
    Infratentorial_MRI: respostas.Infratentorial_MRI as 0 | 1,
    Spinal_Cord_MRI: respostas.Spinal_Cord_MRI as 0 | 1,
  };
}

export function campoRespondido(
  respostas: RespostasTriagem,
  campo: ChaveCampo
): boolean {
  const valor = respostas[campo];
  return typeof valor === "number" && !Number.isNaN(valor);
}