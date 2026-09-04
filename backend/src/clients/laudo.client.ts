import { LAUDO_SERVICE_URL } from '../env';
import { fetchComRetry } from './fetch-com-retry.client';

export async function extrairLaudoDoPdf(arquivo: Buffer, nomeArquivo: string) {
  const form = new FormData();
  const copia = Uint8Array.from(arquivo);
  form.append('arquivo', new Blob([copia], { type: 'application/pdf' }), nomeArquivo);

  const url = `${LAUDO_SERVICE_URL}/laudos/extrair`;
  return chamarLaudo(url, { method: 'POST', body: form }, { nomeArquivo, tamanhoBytes: arquivo.length });
}

export async function getHealth() {
  const url = `${LAUDO_SERVICE_URL}/health`;
  return chamarLaudo(url, { method: 'GET' });
}

async function chamarLaudo(url: string, init: RequestInit, parametros?: unknown) {
  const inicio = Date.now();
  console.log(`[LAUDO] Iniciando chamada ${init.method || 'GET'} ${url}`, parametros);
  try {
    const resposta = await fetchComRetry(url, init);
    const corpo = await resposta.clone().text().catch(() => '');
    console.log(`[LAUDO] Resposta em ${Date.now() - inicio}ms; status=${resposta.status}; corpo=${corpo.slice(0, 200)}`);
    return resposta;
  } catch (erro) {
    console.log(`[LAUDO] Exceção após ${Date.now() - inicio}ms`, erro instanceof Error ? erro.stack : erro);
    throw erro;
  }
}
