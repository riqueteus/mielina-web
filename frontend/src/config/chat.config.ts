import type { Mensagem } from '../types/chat.types';

function normalizarUrl(url: string) { return url.trim().replace(/\/+$/, ''); }

export const API_URL = normalizarUrl(import.meta.env.VITE_API_URL || 'http://localhost:3001');

export const STORAGE_KEY = 'mielina-chat-historico';

export const MENSAGEM_BOAS_VINDAS: Mensagem = {
  id: 0,
  tipo: 'ia',
  texto:
    'Olá! 👋 Sou a assistente virtual da Mielina. Estou aqui para responder suas dúvidas com base nos conteúdos disponíveis sobre Esclerose Múltipla. Como posso ajudar?',
};

export const DELAY_RETRY_PERGUNTA = 5000;
export const DELAY_RETRY_PING = 15_000;
export const TENTATIVAS_PERGUNTA = 2;
export const TENTATIVAS_PING = 6;

export const MENSAGEM_INICIALIZACAO_IA =
  'Inicializando Inteligência Artificial... Devido ao plano gratuito, a primeira inicialização pode levar até 1 minuto.';

export function chaveStoragePorUsuario(userId: string): string {
  return `${STORAGE_KEY}:${userId}`;
}
