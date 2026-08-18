import { Request, Response } from 'express';
import { RequisicaoAutenticada } from '../middlewares/auth.middleware';
import {
  ErroLaudo,
  extrairLaudo,
  graficoDistribuicaoRegioes,
  graficoEvolucaoLesoes,
  listarLaudos,
  salvarLaudoCompleto,
} from '../services/laudo.service';

function tratarErro(err: unknown, res: Response) {
  if (err instanceof ErroLaudo) {
    console.error(`[laudos] Erro ${err.status}: ${err.message}`);
    return res.status(err.status).json({
      erro: err.message,
      ...(err.detalhe !== undefined ? { detalhe: err.detalhe } : {}),
    });
  }

  console.error('[laudos] Erro inesperado:', err);
  return res.status(500).json({ erro: 'Erro interno ao processar o laudo.' });
}

export async function uploadLaudo(req: Request, res: Response) {
  const { supabase, usuario_id } = req as RequisicaoAutenticada;

  try {
    const arquivo = req.file;

    if (!arquivo) {
      return res.status(400).json({ erro: 'Nenhum arquivo enviado (campo "arquivo").' });
    }

    const nomeOriginal = arquivo.originalname || 'laudo.pdf';

    if (!/\.pdf$/i.test(nomeOriginal)) {
      return res.status(400).json({ erro: 'O arquivo deve ser um PDF.' });
    }

    console.log(`[laudos] Processando laudo "${nomeOriginal}" para o usuário ${usuario_id}`);

    const resultado = await extrairLaudo(arquivo.buffer, nomeOriginal);

    const laudo = await salvarLaudoCompleto({
      supabase,
      usuarioId: usuario_id,
      arquivo: arquivo.buffer,
      nomeArquivo: nomeOriginal,
      resultado,
    });

    console.log(`[laudos] Laudo salvo com sucesso (id=${laudo.id}, ${laudo.quantidade_lesoes} lesões)`);

    return res.status(201).json({ laudo });
  } catch (err) {
    return tratarErro(err, res);
  }
}

export async function listar(req: Request, res: Response) {
  const { supabase, usuario_id } = req as RequisicaoAutenticada;

  try {
    const laudos = await listarLaudos(supabase, usuario_id);
    return res.json(laudos);
  } catch (err) {
    return tratarErro(err, res);
  }
}

export async function evolucaoLesoes(req: Request, res: Response) {
  const { supabase, usuario_id } = req as RequisicaoAutenticada;

  try {
    const dados = await graficoEvolucaoLesoes(supabase, usuario_id);
    return res.json(dados);
  } catch (err) {
    return tratarErro(err, res);
  }
}

export async function distribuicaoRegioes(req: Request, res: Response) {
  const { supabase, usuario_id } = req as RequisicaoAutenticada;

  try {
    const dados = await graficoDistribuicaoRegioes(supabase, usuario_id);
    return res.json(dados);
  } catch (err) {
    return tratarErro(err, res);
  }
}
