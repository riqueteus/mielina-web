import { API_URL } from "../config/chat.config"
import type { SessaoRestaurada } from "../types/auth.types"

export async function salvarSessaoNoBackend(refreshToken: string): Promise<void> {
  await fetch(`${API_URL}/api/auth/sessao`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  })
}

export async function restaurarSessaoDoBackend(): Promise<SessaoRestaurada | null> {
  try {
    const resposta = await fetch(`${API_URL}/api/auth/sessao`, {
      credentials: "include",
    })
    if (!resposta.ok) return null
    return (await resposta.json()) as SessaoRestaurada
  } catch {
    return null
  }
}

export async function encerrarSessaoNoBackend(): Promise<void> {
  try {
    await fetch(`${API_URL}/api/auth/sessao`, {
      method: "DELETE",
      credentials: "include",
    })
  } catch {
    // melhor-esforço: o logout local acontece de qualquer forma
  }
}
