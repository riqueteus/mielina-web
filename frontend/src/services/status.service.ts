import {
  API_URL,
  DELAY_RETRY_PING,
  TENTATIVAS_PING,
} from '../config/chat.config';
import type { StatusServicoIA } from '../types/classification.types';
import type { PingResposta } from './ping.service';

export function verificarStatusServico(
  nomeServico: string,
  setStatus: (status: StatusServicoIA) => void
): () => void {
  let cancelado = false;
  let tentativa = 0;

  const falhou = () => {
    if (cancelado) return;
    if (tentativa >= TENTATIVAS_PING) {
      setStatus('indisponivel');
      return;
    }
    setStatus('acordando');
    setTimeout(() => {
      if (!cancelado) aquecerServico();
    }, DELAY_RETRY_PING);
  };

  const aquecerServico = async () => {
    tentativa++;
    const url = `${API_URL}/api/ping?servico=${encodeURIComponent(nomeServico)}`;
    console.log(`[FRONTEND] ${new Date().toISOString()} - polling status; serviço=${nomeServico}; tentativa=${tentativa}; url=${url}`);
    try {
      const res = await fetch(url, { method: 'GET' });
      console.log(`[FRONTEND] ${new Date().toISOString()} - resposta do polling; serviço=${nomeServico}; status=${res.status}`);
      if (cancelado) return;
      const dados = (await res.json().catch(() => null)) as PingResposta | null;
      if (cancelado) return;

      const servico = dados?.servicos?.find((s) => s.nome === nomeServico);
      if (servico?.acordado) {
        setStatus('pronto');
        return;
      }

      falhou();
    } catch (erro) {
      console.log(`[FRONTEND] ${new Date().toISOString()} - erro no polling; serviço=${nomeServico}`, erro);
      falhou();
    }
  };

  aquecerServico();

  return () => {
    cancelado = true;
  };
}
