import { FRONTEND_URL } from '../env';

export function validarOrigem(origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
  if (!origin) return callback(null, true);

  const ehLocalhost = /^https?:\/\/localhost(:\d+)?(\/|$)/.test(origin);
  const eh127 = /^https?:\/\/127\.0\.0\.1(:\d+)?(\/|$)/.test(origin);
  const correspondeFrontendUrl = FRONTEND_URL && origin.startsWith(FRONTEND_URL.replace(/\/$/, ''));
  const ehVercel = /https?:\/\/[\w-]+\.vercel\.app$/.test(origin);
  const ehRender = /https?:\/\/[\w-]+\.onrender\.com$/.test(origin);

  if (ehLocalhost || eh127 || correspondeFrontendUrl || ehVercel || ehRender) {
    return callback(null, true);
  }

  console.error('🚫 Origem bloqueada pelo CORS:', origin);
  return callback(new Error(`Origem ${origin} não permitida pelo CORS.`));
}
