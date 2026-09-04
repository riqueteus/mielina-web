const TEMPOS_LIMITE_MS = [120_000, 90_000, 60_000] as const;
const ATRASO_ENTRE_TENTATIVAS_MS = 10_000;
const MAX_TENTATIVAS = TEMPOS_LIMITE_MS.length;

function combinarSinais(sinalA: AbortSignal, sinalB: AbortSignal): AbortSignal {
  if (typeof AbortSignal.any === 'function') {
    return AbortSignal.any([sinalA, sinalB]);
  }
  const controlador = new AbortController();
  const abortar = () => controlador.abort();
  if (sinalA.aborted || sinalB.aborted) {
    controlador.abort();
    return controlador.signal;
  }
  sinalA.addEventListener('abort', abortar);
  sinalB.addEventListener('abort', abortar);
  return controlador.signal;
}

export async function fetchComRetry(
  url: string,
  init: RequestInit = {},
): Promise<Response> {
  let ultimoErro: unknown;

  for (let tentativa = 0; tentativa < MAX_TENTATIVAS; tentativa++) {
    const controlador = new AbortController();
    const timeoutId = setTimeout(() => controlador.abort(), TEMPOS_LIMITE_MS[tentativa]);

    const sinalExterno = init.signal;
    const sinal = sinalExterno
      ? combinarSinais(sinalExterno, controlador.signal)
      : controlador.signal;

    try {
      const resposta = await fetch(url, { ...init, signal: sinal });
      clearTimeout(timeoutId);
      return resposta;
    } catch (erro) {
      clearTimeout(timeoutId);
      ultimoErro = erro;
      if (tentativa < MAX_TENTATIVAS - 1) {
        await new Promise(resolve => setTimeout(resolve, ATRASO_ENTRE_TENTATIVAS_MS));
      }
    }
  }

  throw ultimoErro;
}