import { RAG_SERVICE_URL } from '../env';

export async function postPergunta(pergunta: string) {
  const resposta = await fetch(`${RAG_SERVICE_URL}/pergunta`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pergunta }),
    signal: AbortSignal.timeout(120_000),
  });

  return resposta;
}

export async function getDocs() {
  const resposta = await fetch(`${RAG_SERVICE_URL}/docs`, {
    method: 'GET',
    signal: AbortSignal.timeout(60_000),
  });

  return resposta;
}
