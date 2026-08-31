import { supabase } from "../lib/supabase"
import { API_URL } from "../config/chat.config"

async function obterToken(): Promise<string> {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (!token) throw new Error("Sessão expirada.")
  return token
}

export async function salvarTriagemAPI(dados: {
  percentualRisco: number
  nivel: "baixo" | "moderado" | "alto"
  mensagem?: string
  payload?: unknown
}) {
  const token = await obterToken()
  const res = await fetch(`${API_URL}/api/triagem/historico`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dados),
  })
  if (!res.ok) throw new Error("Falha ao salvar triagem")
  return res.json()
}

export async function listarTriagensAPI() {
  const token = await obterToken()
  const res = await fetch(`${API_URL}/api/triagem/historico`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error("Falha ao listar triagens")
  return res.json()
}
