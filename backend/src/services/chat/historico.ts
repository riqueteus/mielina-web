import { SupabaseClient } from '@supabase/supabase-js';
import { ErroLaudo } from '../laudo/erros'; // reaproveita classe de erro http

export interface MensagemHistorico {
  id: string;
  tipo: 'usuario' | 'ia' | 'sistema';
  texto: string;
  fontes?: string[] | null;
  criado_em: string;
}

export async function listarHistoricoChat(supabase: SupabaseClient, usuarioId: string, limite = 100) {
  const { data, error } = await supabase
    .from('chat_mensagens')
    .select('id, tipo, texto, fontes, criado_em')
    .eq('usuario_id', usuarioId)
    .order('criado_em', { ascending: true })
    .limit(limite);

  if (error) throw new ErroLaudo(500, 'Falha ao listar histórico do chat.', error);
  return (data ?? []) as MensagemHistorico[];
}

export async function salvarMensagemChat(
  supabase: SupabaseClient,
  usuarioId: string,
  mensagem: { tipo: 'usuario' | 'ia' | 'sistema'; texto: string; fontes?: string[] }
) {
  const { data, error } = await supabase
    .from('chat_mensagens')
    .insert({
      usuario_id: usuarioId,
      tipo: mensagem.tipo,
      texto: mensagem.texto,
      fontes: mensagem.fontes ?? null,
    })
    .select('id, tipo, texto, fontes, criado_em')
    .single();

  if (error) throw new ErroLaudo(500, 'Falha ao salvar mensagem.', error);
  return data as MensagemHistorico;
}

export async function limparHistoricoChat(supabase: SupabaseClient, usuarioId: string) {
  const { error } = await supabase.from('chat_mensagens').delete().eq('usuario_id', usuarioId);
  if (error) throw new ErroLaudo(500, 'Falha ao limpar histórico.', error);
}
