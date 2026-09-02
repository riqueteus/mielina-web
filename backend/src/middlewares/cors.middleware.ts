import { FRONTEND_URL } from '../env';

function normalizarOrigem(url: string): string {
  return url.trim().replace(/\/$/, '').toLowerCase();
}

export function validarOrigem(origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
  if (!origin) return callback(null, true);

  const ehLocalhost = /^https?:\/\/localhost(:\d+)?(\/|$)/i.test(origin);
  const eh127 = /^https?:\/\/127\.0\.0\.1(:\d+)?(\/|$)/i.test(origin);

  const origemNormalizada = normalizarOrigem(origin);
  const frontendPermitido = FRONTEND_URL ? normalizarOrigem(FRONTEND_URL) : null;
  const correspondeFrontendUrl = !!frontendPermitido && origemNormalizada === frontendPermitido;

  if (ehLocalhost || eh127 || correspondeFrontendUrl) {
    return callback(null, true);
  }

  console.error('🚫 Origem bloqueada pelo CORS:', origin);
  return callback(new Error(`Origem ${origin} não permitida pelo CORS.`));
}
