import { supabase } from "../lib/supabase"
import { API_URL } from "../config/chat.config"
import type {
  DistribuicaoRegiao,
  Laudo,
  PontoEvolucaoLesoes,
  ResultadoEnvioLaudo,
} from "../types/laudo.types"

async function obterToken(): Promise<string> {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (!token) throw new Error("Sessão expirada. Faça login novamente.")
  return token
}

export async function enviarLaudoPDF(arquivo: File): Promise<ResultadoEnvioLaudo> {
  try {
    const token = await obterToken()
    console.log(`[FRONTEND] ${new Date().toISOString()} - enviar laudo; tamanhoBytes=${arquivo.size}; tipo=${arquivo.type}`)

    const form = new FormData()
    form.append("arquivo", arquivo)

    const resposta = await fetch(`${API_URL}/api/laudos`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    })
    console.log(`[FRONTEND] ${new Date().toISOString()} - resposta enviar laudo; status=${resposta.status}`)

    if (!resposta.ok) {
      try {
        const corpo = (await resposta.json()) as { erro?: string; detalhe?: unknown }
        const detalhe = corpo.detalhe ? ` ${JSON.stringify(corpo.detalhe)}` : ""
        return {
          sucesso: false,
          erro: `${corpo.erro || `Erro ${resposta.status}`}${detalhe}`,
        }
      } catch {
        return { sucesso: false, erro: `Erro ${resposta.status} ao enviar o laudo.` }
      }
    }

    const dados = (await resposta.json()) as { laudo: Laudo }
    return { sucesso: true, laudo: dados.laudo }
  } catch (err: unknown) {
    console.log(`[FRONTEND] ${new Date().toISOString()} - erro ao enviar laudo`, err)
    return {
      sucesso: false,
      erro: err instanceof Error ? err.message : "Erro ao enviar o laudo.",
    }
  }
}

export async function listarLaudos(): Promise<Laudo[]> {
  const token = await obterToken()
  const resposta = await fetch(`${API_URL}/api/laudos`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!resposta.ok) throw new Error("Falha ao listar laudos.")
  return (await resposta.json()) as Laudo[]
}

export async function excluirLaudo(id: string): Promise<void> {
  const token = await obterToken()
  const resposta = await fetch(`${API_URL}/api/laudos/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!resposta.ok) {
    let mensagem = `Erro ${resposta.status} ao excluir o laudo.`
    try {
      const corpo = (await resposta.json()) as { erro?: string }
      if (corpo.erro) mensagem = corpo.erro
    } catch {
      // mantém a mensagem padrão
    }
    throw new Error(mensagem)
  }
}

export async function obterEvolucaoLesoes(): Promise<PontoEvolucaoLesoes[]> {
  const token = await obterToken()
  const resposta = await fetch(`${API_URL}/api/laudos/grafico/evolucao-lesoes`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!resposta.ok) throw new Error("Falha ao obter evolução de lesões.")
  return (await resposta.json()) as PontoEvolucaoLesoes[]
}

export async function obterDistribuicaoRegioes(): Promise<DistribuicaoRegiao[]> {
  const token = await obterToken()
  const resposta = await fetch(`${API_URL}/api/laudos/grafico/distribuicao-regioes`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!resposta.ok) throw new Error("Falha ao obter distribuição por região.")
  return (await resposta.json()) as DistribuicaoRegiao[]
}
