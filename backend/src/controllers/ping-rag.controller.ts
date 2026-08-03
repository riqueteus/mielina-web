import { Request, Response } from 'express';
import { pingRAG } from '../services/rag.service';

export async function pingRag(req: Request, res: Response) {
  const resultado = await pingRAG();
  return res.json(resultado);
}
