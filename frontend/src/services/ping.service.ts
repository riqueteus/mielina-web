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

  // Simples: logou -> acorda os 3 em paralelo, sem depender de cache
  // Cada fetch acorda 1 serviço no Render (60s de timeout no backend)
  const servicos = ['rag', 'classification', 'laudo'] as const;

  for (const nome of servicos) {
    const url = `${API_URL}/api/ping?servico=${nome}&force=true`;
    console.log(`[WARMUP] ${new Date().toISOString()} - disparando warmup; serviço=${nome}; force=true; url=${url}`);
    fetch(url, { method: 'GET', keepalive: true })
      .then((r) => {
        console.log(`[FRONTEND] ${new Date().toISOString()} - resposta do warmup; serviço=${nome}; status=${r.status}`);
        if (!r.ok) console.warn(`[mielina] Ping ${nome} retornou ${r.status}`);
        return r;
      })
      .catch((err: unknown) => {
        const mensagem = err instanceof Error ? err.message : String(err);
        console.warn(`[mielina] Falha ao acordar ${nome}:`, mensagem);
      });
  }
}
