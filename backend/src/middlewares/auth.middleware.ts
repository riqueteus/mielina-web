import { NextFunction, Request, Response } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';
import { criarClienteSupabase } from '../clients/supabase.client';

export interface RequisicaoAutenticada extends Request {
  usuario_id: string;
  supabase: SupabaseClient;
}

export async function autenticar(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const cabecalho = req.headers.authorization;

  if (!cabecalho || !cabecalho.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Token de autenticação ausente.' });
  }

  const token = cabecalho.slice('Bearer '.length).trim();
  if (!token) {
    return res.status(401).json({ erro: 'Token de autenticação ausente.' });
  }

  const supabase = criarClienteSupabase(token);

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    console.error('Falha na autenticação:', error?.message);
    return res.status(401).json({ erro: 'Sessão inválida ou expirada.' });
  }

  (req as RequisicaoAutenticada).usuario_id = data.user.id;
  (req as RequisicaoAutenticada).supabase = supabase;

  next();
}
