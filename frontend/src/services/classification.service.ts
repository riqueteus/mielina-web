import {
  API_URL,
  DELAY_RETRY_PERGUNTA,
  TENTATIVAS_PERGUNTA,
} from '../config/chat.config';
import { definirNivelRisco, normalizarPercentualRisco } from '../lib/classification.util';
import type {
  DadosTriagem,
  RespostaClassificacao,
  RespostaErroClassificacao,
  ResultadoPrevisao,
  StatusServicoIA,
} from '../types/classification.types';
import { verificarStatusServico } from './status.service';

const SERVICO_CLASSIFICATION = 'classification';

export function verificarStatusClassificacao(
  setStatus: (status: StatusServicoIA) => void
): () => void {
  return verificarStatusServico(SERVICO_CLASSIFICATION, setStatus);
}

export async function enviarTriagem(
  dados: DadosTriagem,
  tentativasRestantes = TENTATIVAS_PERGUNTA
): Promise<ResultadoPrevisao> {
  try {
    const resposta = await fetch(`${API_URL}/api/triagem/prever`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });

    if (!resposta.ok) {
      let erroDados: RespostaErroClassificacao = {};
      try {
        erroDados = (await resposta.json()) as RespostaErroClassificacao;
      } catch {
        /* ignora */
      }

      if (tentativasRestantes > 0 && erroDados.cold_start) {
        await new Promise((r) => setTimeout(r, DELAY_RETRY_PERGUNTA));
        return enviarTriagem(dados, tentativasRestantes - 1);
      }

      return {
        sucesso: false,
        erro:
          erroDados.erro ||
          `Erro ${resposta.status} ao analisar a triagem. Tente novamente.`,
        cold_start: erroDados.cold_start,
      };
    }

    const dadosResposta = (await resposta.json()) as RespostaClassificacao;

    if (dadosResposta.erro) {
      return {
        sucesso: false,
        erro: dadosResposta.mensagem || 'Não foi possível gerar a análise.',
      };
    }

    const percentualRisco = normalizarPercentualRisco(
      dadosResposta.percentual_risco
    );

    return {
      sucesso: true,
      percentualRisco,
      nivel: definirNivelRisco(percentualRisco),
      mensagem: dadosResposta.mensagem,
    };
  } catch (err: unknown) {
    const mensagemErro =
      err instanceof Error ? err.message : 'Erro desconhecido. Tente novamente.';

    if (tentativasRestantes > 0) {
      await new Promise((r) => setTimeout(r, DELAY_RETRY_PERGUNTA));
      return enviarTriagem(dados, tentativasRestantes - 1);
    }

    return { sucesso: false, erro: mensagemErro };
  }
}