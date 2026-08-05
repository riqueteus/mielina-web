import { CLASSIFICATION_SERVICE_URL } from '../env';

export async function postPrever(dados: Record<string, number>) {
  const resposta = await fetch(`${CLASSIFICATION_SERVICE_URL}/classification/prever`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
    signal: AbortSignal.timeout(120_000),
  });

  return resposta;
}

export async function getHealth() {
  const resposta = await fetch(`${CLASSIFICATION_SERVICE_URL}/health`, {
    method: 'GET',
    signal: AbortSignal.timeout(10_000),
  });

  return resposta;
}
