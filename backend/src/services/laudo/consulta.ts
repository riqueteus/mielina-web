import { SupabaseClient } from '@supabase/supabase-js';
import { BUCKET_LAUDOS } from './constantes';
import { ErroLaudo } from './erros';

export async function listarLaudos(supabase: SupabaseClient, usuarioId: string) {
  const { data: laudos, error } = await supabase
    .from('laudos')
    .select(
      'id, data_exame, tipo_exame, regiao_examinada, indicacao_clinica, tecnica, atividade_inflamatoria, biomarcadores_avancados, atrofia_achados_cronicos, conclusao, pdf_url, pdf_nome, criado_em, lesoes(count)'
    )
    .eq('usuario_id', usuarioId)
    .order('data_exame', { ascending: true });

  if (error) {
    console.error('Falha ao listar laudos:', error);
    throw new ErroLaudo(500, 'Falha ao listar laudos.', error);
  }

  const comQuantidade = (laudos ?? []).map((laudo: any) => ({
    ...laudo,
    quantidade_lesoes: laudo.lesoes?.[0]?.count ?? 0,
    lesoes: undefined,
  }));

  return Promise.all(
    comQuantidade.map(async (laudo: any) => {
      if (!laudo.pdf_url) return laudo;

      try {
        const { data, error: erroUrl } = await supabase.storage
          .from(BUCKET_LAUDOS)
          .createSignedUrl(laudo.pdf_url, 3600);

        if (erroUrl || !data?.signedUrl) return laudo;

        return { ...laudo, pdf_url_assinado: data.signedUrl };
      } catch {
        return laudo;
      }
    })
  );
}

export async function graficoEvolucaoLesoes(
  supabase: SupabaseClient,
  usuarioId: string
) {
  const { data, error } = await supabase.rpc('grafico_evolucao_lesoes', {
    p_usuario_id: usuarioId,
  });

  if (error) {
    console.error('Falha ao calcular evolução de lesões:', error);
    throw new ErroLaudo(500, 'Falha ao calcular a evolução de lesões.', error);
  }

  return (data ?? []).map((linha: any) => ({
    data_exame: linha.data_exame,
    quantidade_lesoes: Number(linha.quantidade_lesoes),
  }));
}

export async function graficoDistribuicaoRegioes(
  supabase: SupabaseClient,
  usuarioId: string
) {
  const { data, error } = await supabase.rpc('grafico_distribuicao_regioes', {
    p_usuario_id: usuarioId,
  });

  if (error) {
    console.error('Falha ao calcular distribuição por região:', error);
    throw new ErroLaudo(500, 'Falha ao calcular a distribuição por região.', error);
  }

  return (data ?? []).map((linha: any) => ({
    regiao: linha.regiao,
    quantidade: Number(linha.quantidade),
  }));
}