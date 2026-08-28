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
    try {
      const res = await fetch(`${API_URL}/api/ping?servico=${encodeURIComponent(nomeServico)}`, { method: 'GET' });
      if (cancelado) return;
      const dados = (await res.json().catch(() => null)) as PingResposta | null;
      if (cancelado) return;

      const servico = dados?.servicos?.find((s) => s.nome === nomeServico);
      if (servico?.acordado) {
        setStatus('pronto');
        return;
      }

      falhou();
    } catch {
      falhou();
    }
  };

  aquecerServico();

  return () => {
    cancelado = true;
  };
}