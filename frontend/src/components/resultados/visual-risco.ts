import type { NivelRisco } from "../../types/classification.types";

export interface VisualRisco {
  paleta: "green" | "orange" | "red";
  corBadge: string;
  corBadgeTexto: string;
  rotulo: string;
  descricao: string;
}

export const VISUAL_RISCO: Record<NivelRisco, VisualRisco> = {
  baixo: {
    paleta: "green",
    corBadge: "green.100",
    corBadgeTexto: "green.800",
    rotulo: "Risco baixo",
    descricao:
      "Com base nos dados informados, a possibilidade estimada de evolução para Esclerose Múltipla é baixa. Mantenha o acompanhamento de rotina.",
  },
  moderado: {
    paleta: "orange",
    corBadge: "orange.100",
    corBadgeTexto: "orange.800",
    rotulo: "Risco moderado",
    descricao:
      "Há uma possibilidade considerável. É importante conversar com um médico ou neurologista para uma avaliação adequada.",
  },
  alto: {
    paleta: "red",
    corBadge: "red.100",
    corBadgeTexto: "red.800",
    rotulo: "Risco alto",
    descricao:
      "A possibilidade estimada é alta. Procure um profissional de saúde o quanto antes para avaliação e orientação.",
  },
};