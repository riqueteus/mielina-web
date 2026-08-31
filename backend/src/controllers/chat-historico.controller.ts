import { Request, Response } from 'express';
import { RequisicaoAutenticada } from '../middlewares/auth.middleware';
import { listarHistoricoChat, salvarMensagemChat, limparHistoricoChat } from '../services/chat/historico';
import { ErroLaudo } from '../services/laudo/erros';

function tratarErro(err: unknown, res: Response) {
  if (err instanceof ErroLaudo) return res.status(err.status).json({ erro: err.message, detalhe: err.detalhe });
  return res.status(500).json({ erro: 'Erro interno.' });
}

export async function listarChat(req: Request, res: Response) {
  const { supabase, usuario_id } = req as RequisicaoAutenticada;
  try {
    const historico = await listarHistoricoChat(supabase, usuario_id);
    return res.json(historico);
  } catch (err) {
    return tratarErro(err, res);
  }
}

export async function salvarChat(req: Request, res: Response) {
  const { supabase, usuario_id } = req as RequisicaoAutenticada;
  const { tipo, texto, fontes } = req.body as { tipo?: string; texto?: string; fontes?: string[] };
  if (!tipo || !texto || !['usuario', 'ia', 'sistema'].includes(tipo)) {
    return res.status(400).json({ erro: 'tipo e texto são obrigatórios.' });
  }
  try {
    const msg = await salvarMensagemChat(supabase, usuario_id, { tipo: tipo as any, texto, fontes });
    return res.status(201).json(msg);
  } catch (err) {
    return tratarErro(err, res);
  }
}

export async function limparChat(req: Request, res: Response) {
  const { supabase, usuario_id } = req as RequisicaoAutenticada;
  try {
    await limparHistoricoChat(supabase, usuario_id);
    return res.status(204).send();
  } catch (err) {
    return tratarErro(err, res);
  }
}
