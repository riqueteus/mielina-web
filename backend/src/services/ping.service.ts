import { pingRAG } from './rag.service';
import { pingClassification } from './classification.service';
import { pingLaudo } from './laudo';
import type { PingServico } from '../types/ping';

type PingFn = () => Promise<Omit<PingServico, 'nome'>>;

const SERVICOS_REGISTRADOS: { nome: string; ping: PingFn }[] = [
  { nome: 'rag', ping: pingRAG },
  { nome: 'classification', ping: pingClassification },
  { nome: 'laudo', ping: pingLaudo },
];

// Cache só para sucesso: evita bombardear o Render quando já está acordado.
// Falha NÃO é cacheada por muito tempo, senão o Render acorda em 30s mas ficamos
// retornando "ainda acordando" por 15s sem nem bater nele.
const CACHE_TTL_OK_MS = 30_000;
const CACHE_TTL_FAIL_MS = 3_000;
type CacheEntry = { servicos: PingServico[]; todosProntos: boolean; expiraEm: number };
const cache = new Map<string, CacheEntry>();

function chaveCache(nomes: string[] | undefined): string {
  if (!nomes || nomes.length === 0) return 'todos';
  return [...nomes].sort().join(',');
}

function servicosFiltrados(nomes: string[] | undefined) {
  if (!nomes || nomes.length === 0) return SERVICOS_REGISTRADOS;
  const set = new Set(nomes.map((n) => n.toLowerCase().trim()));
  const filtrados = SERVICOS_REGISTRADOS.filter((s) => set.has(s.nome.toLowerCase()));
  return filtrados.length > 0 ? filtrados : SERVICOS_REGISTRADOS;
}

export async function pingTodosServicos(nomes?: string[], force = false): Promise<{
  servicos: PingServico[];
  todosProntos: boolean;
}> {
  const alvos = servicosFiltrados(nomes);
  const chave = chaveCache(nomes && alvos.length !== SERVICOS_REGISTRADOS.length ? nomes : undefined);
  const inicioPing = Date.now();
  console.log(`[PING] Preparando consulta para: ${alvos.map((s) => s.nome).join(', ')}`);

  // Warmup do login (force=true) NUNCA usa cache - tem que bater no Render de verdade
  if (!force) {
    const cached = cache.get(chave);
    if (cached && Date.now() < cached.expiraEm) {
      console.log(`Ping cache hit (${chave}) — retornando sem chamar Render`);
      return { servicos: cached.servicos, todosProntos: cached.todosProntos };
    }
  } else {
    console.log(`Ping warmup (force) — ignorando cache para ${chave}`);
  }

  console.log(`Ping recebido — consultando ${alvos.length} servico(s): ${alvos.map((s) => s.nome).join(', ')}`);

  const servicos = await Promise.all(
    alvos.map(async ({ nome, ping }) => {
      const inicioServico = Date.now();
      console.log(`[PING] Iniciando consulta do serviço ${nome}`);
      try {
        const resultado = await ping();
        console.log(`[PING] Resultado de ${nome} em ${Date.now() - inicioServico}ms`, resultado);
        return { nome, ...resultado };
      } catch (erro) {
        console.log(`[PING] Exceção ao consultar ${nome} após ${Date.now() - inicioServico}ms`, erro instanceof Error ? erro.stack : erro);
        return { nome, acordado: false, mensagem: 'Erro ao pingar servico.' };
      }
    })
  );

  const todosProntos = servicos.every((s) => s.acordado);

  if (todosProntos) {
    console.log('Todos os servicos consultados estao acordados!');
  } else {
    console.log('Algum(ns) servico(s) ainda acordando...');
  }

  // Só cacheia sucesso por 30s; falha fica só 3s para tentar de novo logo
  const ttl = todosProntos ? CACHE_TTL_OK_MS : CACHE_TTL_FAIL_MS;
  cache.set(chave, { servicos, todosProntos, expiraEm: Date.now() + ttl });
  console.log(`[PING] Fluxo concluído em ${Date.now() - inicioPing}ms; todosProntos=${todosProntos}`);

  return { servicos, todosProntos };
}
