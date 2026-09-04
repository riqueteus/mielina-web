import { Request, Response } from 'express';
import { pingTodosServicos } from '../services/ping.service';

export async function ping(req: Request, res: Response) {
  const inicio = Date.now();
  console.log(`[PING] Entrada recebida em ${new Date().toISOString()}`, { query: req.query });
  const q = req.query.servico ?? req.query.servicos ?? req.query.service;
  let nomes: string[] | undefined;
  if (typeof q === 'string' && q.trim()) {
    nomes = q.split(',').map((s) => s.trim()).filter(Boolean);
  } else if (Array.isArray(q)) {
    nomes = (q as string[]).flatMap((s) => s.split(',')).map((s) => s.trim()).filter(Boolean);
  }
  const force = req.query.force === 'true' || req.query.warmup === 'true';
  console.log(`[PING] Serviços solicitados: ${nomes?.join(', ') || 'todos'}; force=${force}`);
  const resultado = await pingTodosServicos(nomes, force);
  console.log(`[PING] Resultado enviado em ${Date.now() - inicio}ms`, {
    todosProntos: resultado.todosProntos,
    servicos: resultado.servicos.map(({ nome, acordado, mensagem }) => ({ nome, acordado, mensagem })),
  });
  return res.json(resultado);
}
