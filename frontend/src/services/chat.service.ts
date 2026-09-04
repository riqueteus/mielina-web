import { supabase } from '../lib/supabase';
import type {
  ResultadoPergunta,
  RespostaErro,
  RespostaRAG,
  StatusRag,
} from '../types/chat.types';
import {
  API_URL,
  DELAY_RETRY_PERGUNTA,
  TENTATIVAS_PERGUNTA,
} from '../config/chat.config';
import { verificarStatusServico } from './status.service';

async function obterToken(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error('Sessão expirada. Faça login novamente.');
  return token;
}

const SERVICO_CHAT = 'rag';

export function verificarStatusIA(
  setStatusRag: (status: StatusRag) => void
): () => void {
  return verificarStatusServico(SERVICO_CHAT, setStatusRag);
}

export async function enviarPergunta(
  pergunta: string,
  tentativasRestantes = TENTATIVAS_PERGUNTA
): Promise<ResultadoPergunta> {
  try {
    const token = await obterToken();
    console.log(`[FRONTEND] ${new Date().toISOString()} - enviar pergunta; tentativaRestante=${tentativasRestantes}; tamanhoPergunta=${pergunta.length}`);
    const resposta = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ pergunta }),
    });
    console.log(`[FRONTEND] ${new Date().toISOString()} - resposta enviar pergunta; status=${resposta.status}`);

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
    console.log(`[FRONTEND] ${new Date().toISOString()} - erro ao enviar pergunta`, err);
    const mensagemErro =
      err instanceof Error ? err.message : 'Erro desconhecido. Tente novamente.';

    if (tentativasRestantes > 0) {
      await new Promise((r) => setTimeout(r, DELAY_RETRY_PERGUNTA));
      return enviarPergunta(pergunta, tentativasRestantes - 1);
    }

    return { sucesso: false, erro: mensagemErro };
  }
}
