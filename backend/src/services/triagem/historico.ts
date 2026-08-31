import { SupabaseClient } from '@supabase/supabase-js';
import { ErroLaudo } from '../laudo/erros';

export interface TriagemHistorico {
  id: string;
  percentual_risco: number;
  nivel: 'baixo' | 'moderado' | 'alto';
  mensagem?: string | null;
  criado_em: string;
}

export async function listarTriagens(supabase: SupabaseClient, usuarioId: string) {
  const { data, error } = await supabase
    .from('triagem_resultados')
    .select('id, percentual_risco, nivel, mensagem, criado_em')
    .eq('usuario_id', usuarioId)
    .order('criado_em', { ascending: false });

  if (error) throw new ErroLaudo(500, 'Falha ao listar triagens.', error);
  return (data ?? []) as TriagemHistorico[];
}

export async function salvarTriagem(
  supabase: SupabaseClient,
  usuarioId: string,
  dados: { percentualRisco: number; nivel: 'baixo' | 'moderado' | 'alto'; mensagem?: string; payload?: unknown }
) {
  const { data, error } = await supabase
    .from('triagem_resultados')
    .insert({
      usuario_id: usuarioId,
      percentual_risco: dados.percentualRisco,
      nivel: dados.nivel,
      mensagem: dados.mensagem ?? null,
      dados: dados.payload ?? null,
    })
    .select('id, percentual_risco, nivel, mensagem, criado_em')
    .single();

  if (error) throw new ErroLaudo(500, 'Falha ao salvar triagem.', error);
  return data as TriagemHistorico;
}
