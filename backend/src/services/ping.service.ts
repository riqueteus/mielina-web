import { pingRAG } from './rag.service';
import { pingClassification } from './classification.service';
import type { PingServico } from '../types/ping';

type PingFn = () => Promise<Omit<PingServico, 'nome'>>;

const SERVICOS_REGISTRADOS: { nome: string; ping: PingFn }[] = [
  { nome: 'rag', ping: pingRAG },
  { nome: 'classification', ping: pingClassification },
];

export async function pingTodosServicos(): Promise<{
  servicos: PingServico[];
  todosProntos: boolean;
}> {
  console.log(`Ping recebido — acordando ${SERVICOS_REGISTRADOS.length} servico(s) de IA em paralelo...`);

  const servicos = await Promise.all(
    SERVICOS_REGISTRADOS.map(async ({ nome, ping }) => {
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
    console.log('Todos os servicos de IA estao acordados e respondendo!');
  } else {
    console.log('Algum(ns) servico(s) ainda acordando...');
  }

  return { servicos, todosProntos };
}
