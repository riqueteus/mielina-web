import { RAG_SERVICE_URL } from '../env';
import { fetchComRetry } from './fetch-com-retry.client';

export async function postPergunta(pergunta: string) {
  const url = `${RAG_SERVICE_URL}/pergunta`;
  return chamarRag(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pergunta }) }, { pergunta });
}

export async function getDocs() {
  const url = `${RAG_SERVICE_URL}/docs`;
  return chamarRag(url, { method: 'GET' });
}

async function chamarRag(url: string, init: RequestInit, parametros?: unknown) {
  const inicio = Date.now();
  console.log(`[RAG] Iniciando chamada ${init.method || 'GET'} ${url}`, parametros);
  try {
    const resposta = await fetchComRetry(url, init);
    const corpo = await resposta.clone().text().catch(() => '');
    console.log(`[RAG] Resposta em ${Date.now() - inicio}ms; status=${resposta.status}; corpo=${corpo.slice(0, 200)}`);
    return resposta;
  } catch (erro) {
    console.log(`[RAG] Exceção após ${Date.now() - inicio}ms`, erro instanceof Error ? erro.stack : erro);
    throw erro;
  }
}
