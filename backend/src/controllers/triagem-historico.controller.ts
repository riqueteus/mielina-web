import { Request, Response } from 'express';
import { RequisicaoAutenticada } from '../middlewares/auth.middleware';
import { listarTriagens, salvarTriagem } from '../services/triagem/historico';
import { ErroLaudo } from '../services/laudo/erros';

function tratarErro(err: unknown, res: Response) {
  if (err instanceof ErroLaudo) return res.status(err.status).json({ erro: err.message, detalhe: err.detalhe });
  return res.status(500).json({ erro: 'Erro interno.' });
}

export async function listarTriagemHistorico(req: Request, res: Response) {
  const { supabase, usuario_id } = req as RequisicaoAutenticada;
  try {
    const lista = await listarTriagens(supabase, usuario_id);
    return res.json(lista);
  } catch (err) {
    return tratarErro(err, res);
  }
}

export async function salvarTriagemHistorico(req: Request, res: Response) {
  const { supabase, usuario_id } = req as RequisicaoAutenticada;
  const { percentualRisco, nivel, mensagem, payload } = req.body as {
    percentualRisco?: number;
    nivel?: 'baixo' | 'moderado' | 'alto';
    mensagem?: string;
    payload?: unknown;
  };
  if (percentualRisco == null || !nivel) return res.status(400).json({ erro: 'percentualRisco e nivel são obrigatórios.' });
  try {
    const salvo = await salvarTriagem(supabase, usuario_id, { percentualRisco, nivel, mensagem, payload });
    return res.status(201).json(salvo);
  } catch (err) {
    return tratarErro(err, res);
  }
}
