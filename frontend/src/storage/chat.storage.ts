import type { Mensagem } from '../types/chat.types';
import { chaveStoragePorUsuario } from '../config/chat.config';

export function carregarHistorico(userId: string): Mensagem[] {
  try {
    const bruto = localStorage.getItem(chaveStoragePorUsuario(userId));
    if (!bruto) return [];
    const parsed = JSON.parse(bruto);
    if (!Array.isArray(parsed)) return [];
    return parsed as Mensagem[];
  } catch {
    return [];
  }
}

export function salvarHistorico(userId: string, lista: Mensagem[]) {
  try {
    localStorage.setItem(chaveStoragePorUsuario(userId), JSON.stringify(lista));
  } catch {
    /* ignore */
  }
}
