import { Request, Response } from 'express';
import { pingTodosServicos } from '../services/ping.service';

export async function ping(req: Request, res: Response) {
  const q = req.query.servico ?? req.query.servicos ?? req.query.service;
  let nomes: string[] | undefined;
  if (typeof q === 'string' && q.trim()) {
    nomes = q.split(',').map((s) => s.trim()).filter(Boolean);
  } else if (Array.isArray(q)) {
    nomes = (q as string[]).flatMap((s) => s.split(',')).map((s) => s.trim()).filter(Boolean);
  }
  const force = req.query.force === 'true' || req.query.warmup === 'true';
  const resultado = await pingTodosServicos(nomes, force);
  return res.json(resultado);
}
