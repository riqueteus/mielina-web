import { CLASSIFICATION_SERVICE_URL } from '../env';
import { fetchComRetry } from './fetch-com-retry.client';

export async function postPrever(dados: Record<string, number>) {
  const resposta = await fetchComRetry(`${CLASSIFICATION_SERVICE_URL}/classification/prever`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });

  return resposta;
}

export async function getHealth() {
  const resposta = await fetchComRetry(`${CLASSIFICATION_SERVICE_URL}/health`, {
    method: 'GET',
  });

  return resposta;
}
