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
import type { PingResposta } from './ping.service';

const SERVICO_CHAT = 'rag';

export function verificarStatusIA(
  setStatusRag: (status: StatusRag) => void
): () => void {
  let cancelado = false;
  let tentativa = 0;

  const falhou = () => {
    if (cancelado) return;
    if (tentativa >= TENTATIVAS_PING) {
      setStatusRag('indisponivel');
      return;
    }
    setStatusRag('acordando');
    setTimeout(() => {
      if (!cancelado) aquecerRag();
    }, DELAY_RETRY_PING);
  };

  const aquecerRag = async () => {
    tentativa++;
    try {
      const res = await fetch(`${API_URL}/api/ping`, { method: 'GET' });
      if (cancelado) return;
      const dados = (await res.json().catch(() => null)) as PingResposta | null;
      if (cancelado) return;

      const servico = dados?.servicos?.find((s) => s.nome === SERVICO_CHAT);
      if (servico?.acordado) {
        setStatusRag('pronto');
        return;
      }

      falhou();
    } catch {
      falhou();
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
