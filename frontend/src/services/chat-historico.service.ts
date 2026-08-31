import { supabase } from "../lib/supabase"
import { API_URL } from "../config/chat.config"
import type { Mensagem } from "../types/chat.types"

async function obterToken(): Promise<string> {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (!token) throw new Error("Sessão expirada.")
  return token
}

// Seguro: busca do Postgres (RLS por usuario_id), não do localStorage
export async function carregarHistoricoAPI(): Promise<Mensagem[]> {
  const token = await obterToken()
  const res = await fetch(`${API_URL}/api/chat/historico`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error("Falha ao carregar histórico")
  const data = (await res.json()) as Array<{
    id: string
    tipo: Mensagem["tipo"]
    texto: string
    fontes: string[] | null
    criado_em: string
  }>
  // Converte do formato Postgres para Mensagem do frontend
  return data.map((m, idx) => ({
    id: idx + 1,
    tipo: m.tipo,
    texto: m.texto,
    fontes: m.fontes ?? undefined,
  }))
}

export async function salvarMensagemAPI(mensagem: Omit<Mensagem, "id">): Promise<void> {
  const token = await obterToken()
  const res = await fetch(`${API_URL}/api/chat/historico`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(mensagem),
  })
  if (!res.ok) throw new Error("Falha ao salvar mensagem")
}

export async function limparHistoricoAPI(): Promise<void> {
  const token = await obterToken()
  const res = await fetch(`${API_URL}/api/chat/historico`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error("Falha ao limpar histórico")
}
