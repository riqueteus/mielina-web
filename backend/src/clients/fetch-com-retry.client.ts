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
  const inicioTotal = Date.now();

  for (let tentativa = 0; tentativa < MAX_TENTATIVAS; tentativa++) {
    const numeroTentativa = tentativa + 1;
    const timeoutMs = TEMPOS_LIMITE_MS[tentativa];
    const inicioTentativa = Date.now();
    console.log(`[RETRY] Tentativa ${numeroTentativa}/${MAX_TENTATIVAS} para ${url}; timeout=${timeoutMs}ms`);
    const controlador = new AbortController();
    const timeoutId = setTimeout(() => controlador.abort(), timeoutMs);

    const sinalExterno = init.signal;
    const sinal = sinalExterno
      ? combinarSinais(sinalExterno, controlador.signal)
      : controlador.signal;

    try {
      const resposta = await fetch(url, { ...init, signal: sinal });
      clearTimeout(timeoutId);
      console.log(`[RETRY] Sucesso na tentativa ${numeroTentativa}/${MAX_TENTATIVAS} em ${Date.now() - inicioTentativa}ms; total=${Date.now() - inicioTotal}ms; status=${resposta.status}`);
      return resposta;
    } catch (erro) {
      clearTimeout(timeoutId);
      ultimoErro = erro;
      console.log(`[RETRY] Erro na tentativa ${numeroTentativa}/${MAX_TENTATIVAS} após ${Date.now() - inicioTentativa}ms`, erro instanceof Error ? erro.stack : erro);
      if (tentativa < MAX_TENTATIVAS - 1) {
        await new Promise(resolve => setTimeout(resolve, ATRASO_ENTRE_TENTATIVAS_MS));
      }
    }
  }

  console.log(`[RETRY] Todas as ${MAX_TENTATIVAS} tentativas falharam após ${Date.now() - inicioTotal}ms`, ultimoErro instanceof Error ? ultimoErro.stack : ultimoErro);
  throw ultimoErro;
}
