import { NextFunction, Request, Response } from 'express';
import { RateLimiterAbstract } from 'rate-limiter-flexible';
import {
  rateLimiterAuth,
  rateLimiterChat,
  rateLimiterGlobal,
  rateLimiterLaudosCriar,
  rateLimiterTriagem,
} from '../services/rate-limit.service';
import { RequisicaoAutenticada } from './auth.middleware';

function extrairIp(req: Request): string {
  const xForwarded = req.headers['x-forwarded-for'];
  if (xForwarded) {
    return Array.isArray(xForwarded) ? xForwarded[0] : xForwarded.split(',')[0].trim();
  }
  return (req.ip && req.ip !== '::ffff:127.0.0.1') ? req.ip : '127.0.0.1';
}

function segundosRestantes(ms: number): number {
  return Math.max(1, Math.ceil(ms / 1000));
}

async function consumirELidar(
  limiterPromise: Promise<RateLimiterAbstract>,
  chave: string,
  req: Request,
  res: Response,
  next: NextFunction,
  mensagemErro: string,
) {
  try {
    const limiter = await limiterPromise;
    await limiter.consume(chave);
    next();
  } catch (resultado: any) {
    if (resultado && typeof resultado.msBeforeNext === 'number') {
      const restante = segundosRestantes(resultado.msBeforeNext);
      const resetTimestamp = Math.ceil(Date.now() / 1000) + restante;
      res.setHeader('Retry-After', String(restante));
      res.setHeader('X-RateLimit-Limit', String(resultado.limit ?? '?'));
      res.setHeader('X-RateLimit-Reset', String(resetTimestamp));
      return res.status(429).json({
        erro: mensagemErro,
        detalhes: `Tente novamente em ${restante} segundos.`,
      });
    }
    next(resultado);
  }
}

export async function rateLimitGlobal(req: Request, res: Response, next: NextFunction) {
  const chave = `ip:${extrairIp(req)}`;
  return consumirELidar(
    rateLimiterGlobal,
    chave,
    req,
    res,
    next,
    'Muitas requisições. Limite global de 300 requisições por minuto atingido.',
  );
}

export async function rateLimitAuth(req: Request, res: Response, next: NextFunction) {
  const chave = `auth:ip:${extrairIp(req)}`;
  return consumirELidar(
    rateLimiterAuth,
    chave,
    req,
    res,
    next,
    'Muitas tentativas de autenticação. Limite de 15 por minuto atingido.',
  );
}

function rateLimitPorUsuario(
  limiterPromise: Promise<RateLimiterAbstract>,
  prefixoChave: string,
  mensagemErro: string,
) {
  return async function middleware(req: Request, res: Response, next: NextFunction) {
    const reqAuth = req as RequisicaoAutenticada;
    const usuarioId = reqAuth.usuario_id;

    if (!usuarioId) {
      return res.status(401).json({ erro: 'Usuário não autenticado.' });
    }

    const chave = `${prefixoChave}:u:${usuarioId}`;
    return consumirELidar(limiterPromise, chave, req, res, next, mensagemErro);
  };
}

export const rateLimitChat = rateLimitPorUsuario(
  rateLimiterChat,
  'chat',
  'Limite de perguntas no chat atingido. Permitido 50 por hora por usuário.',
);

export const rateLimitTriagem = rateLimitPorUsuario(
  rateLimiterTriagem,
  'triagem',
  'Limite de triagens diárias atingido. Permitido 20 por dia por usuário.',
);

export const rateLimitLaudosCriar = rateLimitPorUsuario(
  rateLimiterLaudosCriar,
  'laudos',
  'Limite de uploads de laudos diário atingido. Permitido 30 por dia por usuário.',
);
