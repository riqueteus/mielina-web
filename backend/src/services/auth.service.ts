import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../env';

interface SessaoRenovada {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export async function renovarSessao(refreshToken: string): Promise<SessaoRenovada> {
  const resposta = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY as string,
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!resposta.ok) {
    throw new Error('Refresh token inválido ou expirado.');
  }

  return (await resposta.json()) as SessaoRenovada;
}

export async function revogarSessao(refreshToken: string): Promise<void> {
  try {
    await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY as string,
        Authorization: `Bearer ${refreshToken}`,
      },
      body: JSON.stringify({}),
    });
  } catch {
    // revogação é melhor-esforço: o cookie é removido de qualquer forma
  }
}
