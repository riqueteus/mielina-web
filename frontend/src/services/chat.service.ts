import type {
  ResultadoPergunta,
  RespostaErro,
  RespostaRAG,
  StatusRag,
} from '../types/chat.types';
import {
  API_URL,
  DELAY_RETRY_PERGUNTA,
  DELAY_RETRY_PING,
  TENTATIVAS_PERGUNTA,
  TENTATIVAS_PING,
} from '../config/chat.config';

export function verificarStatusIA(
  setStatusRag: (status: StatusRag) => void
): () => void {
  let cancelado = false;
  let tentativa = 0;

  const aquecerRag = async () => {
    tentativa++;
    try {
      const res = await fetch(`${API_URL}/api/ping-rag`, { method: 'GET' });
      if (cancelado) return;
      const dados = await res.json().catch(() => ({ acordado: false }));
      if (cancelado) return;

      if (dados.acordado) {
        setStatusRag('pronto');
        return;
      }

      if (tentativa >= TENTATIVAS_PING) {
        setStatusRag('indisponivel');
        return;
      }

      setStatusRag('acordando');
      setTimeout(() => {
        if (!cancelado) aquecerRag();
      }, DELAY_RETRY_PING);
    } catch {
      if (cancelado) return;
      if (tentativa >= TENTATIVAS_PING) {
        setStatusRag('indisponivel');
        return;
      }
      setStatusRag('acordando');
      setTimeout(() => {
        if (!cancelado) aquecerRag();
      }, DELAY_RETRY_PING);
    }
  };

  aquecerRag();

  return () => {
    cancelado = true;
  };
}

export async function enviarPergunta(
  pergunta: string,
  tentativasRestantes = TENTATIVAS_PERGUNTA
): Promise<ResultadoPergunta> {
  try {
    const resposta = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pergunta }),
    });

    if (!resposta.ok) {
      let erroDados: RespostaErro = {};
      try {
        erroDados = (await resposta.json()) as RespostaErro;
      } catch {
        /* ignora */
      }

      if (tentativasRestantes > 0 && erroDados.cold_start) {
        await new Promise((r) => setTimeout(r, DELAY_RETRY_PERGUNTA));
        return enviarPergunta(pergunta, tentativasRestantes - 1);
      }

      return {
        sucesso: false,
        erro: erroDados.erro || `Erro ${resposta.status} ao enviar pergunta`,
        cold_start: erroDados.cold_start,
      };
    }

    const dados = (await resposta.json()) as RespostaRAG;

    return {
      sucesso: true,
      resposta: dados.resposta || '(Sem resposta)',
      fontes: dados.fontes,
    };
  } catch (err: unknown) {
    const mensagemErro =
      err instanceof Error ? err.message : 'Erro desconhecido. Tente novamente.';

    if (tentativasRestantes > 0) {
      await new Promise((r) => setTimeout(r, DELAY_RETRY_PERGUNTA));
      return enviarPergunta(pergunta, tentativasRestantes - 1);
    }

    return { sucesso: false, erro: mensagemErro };
  }
}
