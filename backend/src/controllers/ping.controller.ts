import { Request, Response } from 'express';
import { pingTodosServicos } from '../services/ping.service';

export async function ping(req: Request, res: Response) {
  const resultado = await pingTodosServicos();
  return res.json(resultado);
}
