import { pingRAG } from './rag.service';
import { pingClassification } from './classification.service';
import type { PingServico } from '../types/ping';

export async function pingTodosServicos(): Promise<{
  servicos: PingServico[];
  todosProntos: boolean;
}> {
  console.log('Ping recebido — acordando todos os servicos de IA em paralelo...');

  const [rag, classification] = await Promise.all([pingRAG(), pingClassification()]);

  const servicos: PingServico[] = [
    { nome: 'rag', ...rag },
    { nome: 'classification', ...classification },
  ];

  const todosProntos = servicos.every((s) => s.acordado);

  if (todosProntos) {
    console.log('Todos os servicos de IA estao acordados e respondendo!');
  } else {
    console.log('Algum(ns) servico(s) ainda acordando...');
  }

  return { servicos, todosProntos };
}
