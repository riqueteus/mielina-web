import crypto from 'node:crypto';
import { SupabaseClient } from '@supabase/supabase-js';
import { extrairLaudoDoPdf } from '../clients/laudo.client';
import type {
  LaudoEstruturado,
  Lesao,
  RegiaoCanonica,
  RespostaExtrairLaudo,
} from '../types/laudo.types';

export class ErroLaudo extends Error {
  constructor(
    public status: number,
    message: string,
    public detalhe?: unknown
  ) {
    super(message);
    this.name = 'ErroLaudo';
  }
}

const BUCKET_LAUDOS = 'laudos';

// ---------------------------------------------------------------------------
// Normalização da região para buckets canônicos
// ---------------------------------------------------------------------------

const MAPA_REGIOES: Array<{ chave: RegiaoCanonica; padroes: RegExp[] }> = [
  {
    chave: 'periventricular',
    padroes: [/periventricular/i, /pericalos/i, /pericallos/i],
  },
  {
    chave: 'justacortical',
    padroes: [/justacortical/i, /justa.cortical/i, /subcortical/i, /cortical/i],
  },
  {
    chave: 'infratentorial',
    padroes: [
      /infratentorial/i,
      /cerebelar/i,
      /cerebelo/i,
      /fossa posterior/i,
      /ped[úu]nculo/i,
      /tronco cerebral/i,
      /mesenc[ée]falo/i,
      /bulbo/i,
    ],
  },
  {
    chave: 'medular',
    padroes: [/medular/i, /medula/i, /espinhal/i, /mielop[aá]tica/i],
  },
];

export function normalizarRegiao(regiao: string | null): RegiaoCanonica {
  if (!regiao) return 'outra';
  const texto = regiao.trim().toLowerCase();
  if (!texto) return 'outra';

  for (const grupo of MAPA_REGIOES) {
    if (grupo.padroes.some((padrao) => padrao.test(texto))) {
      return grupo.chave;
    }
  }

  return 'outra';
}

// ---------------------------------------------------------------------------
// Validação da resposta do laudo-service
// ---------------------------------------------------------------------------

export function validarRespostaLaudoService(
  corpo: unknown
): { valido: boolean; resultado?: LaudoEstruturado; erros: string[] } {
  if (!corpo || typeof corpo !== 'object') {
    return { valido: false, erros: ['Resposta do laudo-service não é um JSON válido.'] };
  }

  const resultado = (corpo as RespostaExtrairLaudo).resultado;

  if (!resultado || typeof resultado !== 'object') {
    return { valido: false, erros: ['Campo "resultado" ausente na resposta do laudo-service.'] };
  }

  const identificacao = resultado.identificacao_protocolo;

  if (!identificacao || typeof identificacao !== 'object') {
    return { valido: false, erros: ['Campo "identificacao_protocolo" ausente na resposta.'] };
  }

  if (!Array.isArray(resultado.lesoes)) {
    return { valido: false, erros: ['Campo "lesoes" deve ser um array.'] };
  }

  const dataExame = identificacao.data_exame;
  if (dataExame !== null && (typeof dataExame !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dataExame))) {
    return { valido: false, erros: ['"data_exame" deve ser texto no formato AAAA-MM-DD ou null.'] };
  }

  return { valido: true, resultado, erros: [] };
}

function dataHojeISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function normalizarLesoes(lesoes: Lesao[]) {
  return lesoes.map((lesao) => ({
    ...lesao,
    regiao: normalizarRegiao(lesao.regiao),
    localizacao: lesao.localizacao ?? lesao.regiao,
  }));
}

// ---------------------------------------------------------------------------
// Persistência
// ---------------------------------------------------------------------------

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
}: {
  supabase: SupabaseClient;
  usuarioId: string;
  arquivo: Buffer;
  nomeArquivo: string;
  resultado: LaudoEstruturado;
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

  // 2) Preparar dados normalizados
  const identificacao = resultado.identificacao_protocolo;
  const dataExame = identificacao.data_exame ?? dataHojeISO();
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
      p_lesoes: lesoesNormalizadas,
    }
  );

  if (erroInsercao) {
    console.error('Falha ao inserir laudo no banco:', erroInsercao);
    await removerPdfSeExistir(supabase, caminhoPdf);
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

// ---------------------------------------------------------------------------
// Rotas de leitura / agregação
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Chamada ao laudo-service
// ---------------------------------------------------------------------------

export async function extrairLaudo(arquivo: Buffer, nomeArquivo: string) {
  let resposta: Response;

  try {
    resposta = await extrairLaudoDoPdf(arquivo, nomeArquivo);
  } catch (err: any) {
    if (err?.name === 'TimeoutError') {
      throw new ErroLaudo(504, 'Tempo de resposta do serviço de laudos esgotado.', err);
    }
    throw new ErroLaudo(502, 'Serviço de laudos indisponível no momento.', err);
  }

  if (resposta.status === 400) {
    let detalhe = '';
    try {
      detalhe = JSON.stringify(await resposta.json());
    } catch {
      detalhe = await resposta.text().catch(() => '');
    }
    throw new ErroLaudo(422, 'Não foi possível extrair o texto do PDF.', detalhe);
  }

  if (resposta.status === 502) {
    let detalhe = '';
    try {
      detalhe = JSON.stringify(await resposta.json());
    } catch {
      detalhe = await resposta.text().catch(() => '');
    }
    throw new ErroLaudo(502, 'A IA de extração de laudos falhou ao processar o PDF.', detalhe);
  }

  if (!resposta.ok) {
    throw new ErroLaudo(502, 'Serviço de laudos retornou erro inesperado.', resposta.status);
  }

  let corpo: unknown;
  try {
    corpo = await resposta.json();
  } catch {
    throw new ErroLaudo(422, 'Resposta do laudo-service não é um JSON válido.');
  }

  const validacao = validarRespostaLaudoService(corpo);
  if (!validacao.valido) {
    throw new ErroLaudo(422, validacao.erros.join(' '), corpo);
  }

  return validacao.resultado as LaudoEstruturado;
}
