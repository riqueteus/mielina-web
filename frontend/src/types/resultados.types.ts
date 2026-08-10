import type { NivelRisco } from "./classification.types";

export type TipoResultado = "triagem" | "ressonancia";

interface HistoricoBase {
  id: string;
  criadoEm: string;
}

export interface ResultadoTriagemHistorico extends HistoricoBase {
  tipo: "triagem";
  percentualRisco: number;
  nivel: NivelRisco;
  mensagem?: string;
}

export interface ResultadoRessonanciaHistorico extends HistoricoBase {
  tipo: "ressonancia";
  mensagem?: string;
}

export type ResultadoHistorico =
  | ResultadoTriagemHistorico
  | ResultadoRessonanciaHistorico;