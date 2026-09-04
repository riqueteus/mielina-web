import { RAG_SERVICE_URL } from '../env';
import { fetchComRetry } from './fetch-com-retry.client';

export async function postPergunta(pergunta: string) {
  const resposta = await fetchComRetry(`${RAG_SERVICE_URL}/pergunta`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pergunta }),
  });

  return resposta;
}

export async function getDocs() {
  const resposta = await fetchComRetry(`${RAG_SERVICE_URL}/docs`, {
    method: 'GET',
  });

  return resposta;
}
