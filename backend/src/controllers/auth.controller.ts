import { Request, Response } from 'express';
import { renovarSessao, revogarSessao } from '../services/auth.service';
import { COOKIE_SECURE, COOKIE_SAME_SITE } from '../env';

const NOME_COOKIE = 'mielina_rt';

const opcoesCookie = {
  httpOnly: true,
  secure: COOKIE_SECURE,
  sameSite: COOKIE_SAME_SITE,
  path: '/api/auth',
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

export async function salvarSessao(req: Request, res: Response) {
  const { refresh_token: refreshToken } = req.body ?? {};

  if (typeof refreshToken !== 'string' || !refreshToken) {
    return res.status(400).json({ erro: 'refresh_token é obrigatório.' });
  }

  try {
    const sessao = await renovarSessao(refreshToken);
    res.cookie(NOME_COOKIE, sessao.refresh_token, opcoesCookie);
    return res.json({
      access_token: sessao.access_token,
      refresh_token: sessao.refresh_token,
      expires_in: sessao.expires_in,
    });
  } catch {
    return res.status(401).json({ erro: 'Refresh token inválido ou expirado.' });
  }
}

export async function restaurarSessao(req: Request, res: Response) {
  const refreshToken = req.cookies?.[NOME_COOKIE];

  if (!refreshToken) {
    return res.status(401).json({ erro: 'Sem sessão ativa.' });
  }

  try {
    const sessao = await renovarSessao(refreshToken);
    res.cookie(NOME_COOKIE, sessao.refresh_token, opcoesCookie);
    return res.json({
      access_token: sessao.access_token,
      refresh_token: sessao.refresh_token,
      expires_in: sessao.expires_in,
    });
  } catch {
    res.clearCookie(NOME_COOKIE, { path: '/api/auth' });
    return res.status(401).json({ erro: 'Sessão expirada.' });
  }
}

export async function encerrarSessao(req: Request, res: Response) {
  const refreshToken = req.cookies?.[NOME_COOKIE];

  if (refreshToken) {
    await revogarSessao(refreshToken);
  }

  res.clearCookie(NOME_COOKIE, { path: '/api/auth' });
  return res.json({ ok: true });
}
