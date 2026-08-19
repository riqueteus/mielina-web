import crypto from 'node:crypto';
import { SupabaseClient } from '@supabase/supabase-js';
import type { LaudoEstruturado } from '../../types/laudo.types';
import { BUCKET_LAUDOS } from './constantes';
import { ErroLaudo } from './erros';
import { normalizarLesoes } from './normalizacao';

export function calcularHashPdf(arquivo: Buffer): string {
  return crypto.createHash('sha256').update(arquivo).digest('hex');
}

export async function verificarLaudoDuplicado(
  supabase: SupabaseClient,
  usuarioId: string,
  hash: string
) {
  const { data: duplicado, error } = await supabase
    .from('laudos')
    .select('id')
    .eq('usuario_id', usuarioId)
    .eq('pdf_hash', hash)
    .maybeSingle();

  if (error) {
    console.error('Falha ao verificar laudo duplicado:', error);
    throw new ErroLaudo(500, 'Falha ao verificar laudos duplicados.', error);
  }

  if (duplicado) {
    throw new ErroLaudo(409, 'Este PDF já foi enviado. O mesmo laudo não pode ser salvo mais de uma vez.');
  }
}

async function removerPdfSeExistir(supabase: SupabaseClient, caminho: string) {
  try {
    await supabase.storage.from(BUCKET_LAUDOS).remove([caminho]);
  } catch (err) {
    console.error('Falha ao limpar PDF do storage:', err);
  }
}

export async function salvarLaudoCompleto({
  supabase,
  usuarioId,
  arquivo,
  nomeArquivo,
  resultado,
  hash,
}: {
  supabase: SupabaseClient;
  usuarioId: string;
  arquivo: Buffer;
  nomeArquivo: string;
  resultado: LaudoEstruturado;
  hash: string;
}) {
  // 1) Upload do PDF para o bucket privado `laudos/{usuario_id}/...`
  const caminhoPdf = `${usuarioId}/${crypto.randomUUID()}.pdf`;

  const { error: erroUpload } = await supabase.storage
    .from(BUCKET_LAUDOS)
    .upload(caminhoPdf, arquivo, {
      contentType: 'application/pdf',
      upsert: false,
    });

  if (erroUpload) {
    console.error('Falha ao enviar PDF ao Supabase Storage:', erroUpload);
    throw new ErroLaudo(500, 'Falha ao salvar o PDF no armazenamento.', erroUpload);
  }

  // 2) Preparar dados normalizados (data_exame fica null se a IA não extraiu)
  const identificacao = resultado.identificacao_protocolo;
  const dataExame = identificacao.data_exame;
  const lesoesNormalizadas = normalizarLesoes(resultado.lesoes);

  // 3) Inserir laudo + lesões em uma única transação (RPC no Postgres)
  const { data: laudoId, error: erroInsercao } = await supabase.rpc(
    'inserir_laudo_completo',
    {
      p_usuario_id: usuarioId,
      p_data_exame: dataExame,
      p_tipo_exame: identificacao.tipo_exame ?? null,
      p_regiao_examinada: identificacao.regiao_examinada ?? null,
      p_indicacao_clinica: identificacao.indicacao_clinica ?? null,
      p_tecnica: identificacao.tecnica ?? null,
      p_atividade_inflamatoria: resultado.atividade_inflamatoria,
      p_biomarcadores_avancados: resultado.biomarcadores_avancados,
      p_atrofia_achados_cronicos: resultado.atrofia_achados_cronicos,
      p_conclusao: resultado.conclusao,
      p_pdf_url: caminhoPdf,
      p_pdf_nome: nomeArquivo,
      p_pdf_hash: hash,
      p_lesoes: lesoesNormalizadas,
    }
  );

  if (erroInsercao) {
    console.error('Falha ao inserir laudo no banco:', erroInsercao);
    await removerPdfSeExistir(supabase, caminhoPdf);
    if (erroInsercao.code === '23505') {
      throw new ErroLaudo(409, 'Este PDF já foi enviado. O mesmo laudo não pode ser salvo mais de uma vez.', erroInsercao);
    }
    throw new ErroLaudo(500, 'Falha ao salvar o laudo no banco de dados.', erroInsercao);
  }

  // 4) Buscar o laudo completo para retornar
  return buscarLaudoCompleto(supabase, laudoId as string, usuarioId);
}

export async function buscarLaudoCompleto(
  supabase: SupabaseClient,
  laudoId: string,
  usuarioId: string
) {
  const { data: laudo, error: erroLaudo } = await supabase
    .from('laudos')
    .select(
      'id, data_exame, tipo_exame, regiao_examinada, indicacao_clinica, tecnica, atividade_inflamatoria, biomarcadores_avancados, atrofia_achados_cronicos, conclusao, pdf_url, pdf_nome, criado_em'
    )
    .eq('id', laudoId)
    .eq('usuario_id', usuarioId)
    .single();

  if (erroLaudo || !laudo) {
    throw new ErroLaudo(500, 'Laudo salvo, mas não foi possível lê-lo de volta.', erroLaudo);
  }

  const { data: lesoes, error: erroLesoes } = await supabase
    .from('lesoes')
    .select('id, localizacao, regiao, caracteristica, evidencia, tamanho_mm, realce_contraste')
    .eq('laudo_id', laudoId)
    .order('id', { ascending: true });

  if (erroLesoes) {
    throw new ErroLaudo(500, 'Laudo salvo, mas não foi possível ler as lesões.', erroLesoes);
  }

  return {
    ...laudo,
    quantidade_lesoes: lesoes?.length ?? 0,
    lesoes: lesoes ?? [],
  };
}

export async function excluirLaudo(
  supabase: SupabaseClient,
  usuarioId: string,
  laudoId: string
) {
  const { data: laudo, error: erroBusca } = await supabase
    .from('laudos')
    .select('id, pdf_url')
    .eq('id', laudoId)
    .eq('usuario_id', usuarioId)
    .single();

  if (erroBusca || !laudo) {
    throw new ErroLaudo(404, 'Laudo não encontrado.', erroBusca);
  }

  const { error: erroExclusao } = await supabase
    .from('laudos')
    .delete()
    .eq('id', laudoId)
    .eq('usuario_id', usuarioId);

  if (erroExclusao) {
    console.error('Falha ao excluir laudo:', erroExclusao);
    throw new ErroLaudo(500, 'Falha ao excluir o laudo.', erroExclusao);
  }

  if (laudo.pdf_url) {
    await removerPdfSeExistir(supabase, laudo.pdf_url);
  }

  return { id: laudoId };
}