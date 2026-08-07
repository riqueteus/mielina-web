import { API_URL } from '../config/chat.config';

export interface StatusServico {
  nome: string;
  acordado: boolean;
  mensagem: string;
}

export interface PingResposta {
  servicos: StatusServico[];
  todosProntos: boolean;
}

export function pingServicosIA(): void {
  if (typeof window === 'undefined') return;

  const url = `${API_URL}/api/ping`;

  fetch(url, {
    method: 'GET',
    keepalive: true,
  }).catch((err: unknown) => {
    const mensagem = err instanceof Error ? err.message : String(err);
    console.warn('[mielina] Falha ao pingar servicos de IA:', mensagem);
  });
}
