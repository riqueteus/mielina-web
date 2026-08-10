export const RESULTADOS_STORAGE_KEY = "mielina-resultados-historico";

export const LIMITE_RESULTADOS = 30;

export function chaveStorageResultados(userId: string): string {
  return `${RESULTADOS_STORAGE_KEY}:${userId}`;
}