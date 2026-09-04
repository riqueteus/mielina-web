import { CLASSIFICATION_SERVICE_URL } from '../env';
import { fetchComRetry } from './fetch-com-retry.client';

export async function postPrever(dados: Record<string, number>) {
  const url = `${CLASSIFICATION_SERVICE_URL}/classification/prever`;
  return chamarClassification(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dados) }, dados);
}

export async function getHealth() {
  const url = `${CLASSIFICATION_SERVICE_URL}/health`;
  return chamarClassification(url, { method: 'GET' });
}

async function chamarClassification(url: string, init: RequestInit, parametros?: unknown) {
  const inicio = Date.now();
  console.log(`[CLASS] Iniciando chamada ${init.method || 'GET'} ${url}`, parametros);
  try {
    const resposta = await fetchComRetry(url, init);
    const corpo = await resposta.clone().text().catch(() => '');
    console.log(`[CLASS] Resposta em ${Date.now() - inicio}ms; status=${resposta.status}; corpo=${corpo.slice(0, 200)}`);
    return resposta;
  } catch (erro) {
    console.log(`[CLASS] Exceção após ${Date.now() - inicio}ms`, erro instanceof Error ? erro.stack : erro);
    throw erro;
  }
}
