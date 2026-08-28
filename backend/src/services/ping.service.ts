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

// Cache simples para não bombardear o Render: se o frontend ficar fazendo polling
// a cada 8s, o backend reutiliza o último resultado por 15s sem bater nos 3 serviços
const CACHE_TTL_MS = 15_000;
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

export async function pingTodosServicos(nomes?: string[]): Promise<{
  servicos: PingServico[];
  todosProntos: boolean;
}> {
  const alvos = servicosFiltrados(nomes);
  const chave = chaveCache(nomes && alvos.length !== SERVICOS_REGISTRADOS.length ? nomes : undefined);

  // Se tem cache válido, retorna sem bater no Render
  const cached = cache.get(chave);
  if (cached && Date.now() < cached.expiraEm) {
    console.log(`Ping cache hit (${chave}) — retornando sem chamar Render`);
    return { servicos: cached.servicos, todosProntos: cached.todosProntos };
  }

  console.log(`Ping recebido — consultando ${alvos.length} servico(s): ${alvos.map((s) => s.nome).join(', ')}`);

  const servicos = await Promise.all(
    alvos.map(async ({ nome, ping }) => {
      try {
        const resultado = await ping();
        return { nome, ...resultado };
      } catch {
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

  cache.set(chave, { servicos, todosProntos, expiraEm: Date.now() + CACHE_TTL_MS });

  return { servicos, todosProntos };
}
