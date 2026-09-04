import { LAUDO_SERVICE_URL } from '../env';
import { fetchComRetry } from './fetch-com-retry.client';

export async function extrairLaudoDoPdf(arquivo: Buffer, nomeArquivo: string) {
  const form = new FormData();
  const copia = Uint8Array.from(arquivo);
  form.append('arquivo', new Blob([copia], { type: 'application/pdf' }), nomeArquivo);

  const resposta = await fetch(`${LAUDO_SERVICE_URL}/laudos/extrair`, {
    method: 'POST',
    body: form,
    signal: AbortSignal.timeout(120_000),
  });

  return resposta;
}

export async function getHealth() {
  const resposta = await fetchComRetry(`${LAUDO_SERVICE_URL}/health`, {
    method: 'GET',
  });

  return resposta;
}
