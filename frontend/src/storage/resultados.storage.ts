import {
  LIMITE_RESULTADOS,
  chaveStorageResultados,
} from "../config/resultados.config";
import type { ResultadoHistorico } from "../types/resultados.types";

export function carregarResultados(userId: string): ResultadoHistorico[] {
  try {
    const bruto = localStorage.getItem(chaveStorageResultados(userId));
    if (!bruto) return [];
    const parsed = JSON.parse(bruto);
    if (!Array.isArray(parsed)) return [];
    return (parsed as ResultadoHistorico[]).sort((a, b) =>
      a.criadoEm < b.criadoEm ? 1 : -1
    );
  } catch {
    return [];
  }
}

export function salvarResultadoLocal(
  userId: string,
  resultado: ResultadoHistorico
) {
  try {
    const lista = [
      resultado,
      ...carregarResultados(userId).filter((r) => r.id !== resultado.id),
    ];
    localStorage.setItem(
      chaveStorageResultados(userId),
      JSON.stringify(lista.slice(0, LIMITE_RESULTADOS))
    );
  } catch {
    /* ignore */
  }
}