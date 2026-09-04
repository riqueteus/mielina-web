import { postPrever, getHealth } from '../clients/classification.client';

export async function preverComRetry(dados: Record<string, number>, tentativas = 3) {
  let ultimoErro: unknown;

  for (let tentativa = 1; tentativa <= tentativas; tentativa++) {
    try {
      console.log(`Tentativa ${tentativa}/${tentativas} de chamar o classification service...`);

      const resposta = await postPrever(dados);

      if (!resposta.ok) {
        const erroTexto = await resposta.text();
        console.error(`Tentativa ${tentativa}: classification retornou status ${resposta.status}`);

        if (tentativa < tentativas && resposta.status >= 500) {
          await new Promise((r) => setTimeout(r, 3000));
          continue;
        }

        return {
          ok: false,
          status: 502,
          body: {
            erro: 'Serviço de classificação indisponível no momento.',
            detalhe: erroTexto,
          },
        };
      }

      const resultado = await resposta.json();

      if (resultado.erro) {
        return {
          ok: false,
          status: 422,
          body: {
            erro: resultado.mensagem || 'O serviço de classificação retornou um erro.',
          },
        };
      }

      return { ok: true, status: 200, body: resultado };
    } catch (err: any) {
      ultimoErro = err;

      if (err.name === 'TimeoutError') {
        console.error(`Tentativa ${tentativa}: Timeout (120s). Classification provavelmente acordando...`);
      } else {
        console.error(`Tentativa ${tentativa}: Erro de rede - ${err.message || err}`);
      }

      if (tentativa < tentativas) {
        console.log(`Esperando 4s antes da próxima tentativa...`);
        await new Promise((r) => setTimeout(r, 4000));
      }
    }
  }

  const erro = ultimoErro as any;
  const isTimeout = erro?.name === 'TimeoutError';

  return {
    ok: false,
    status: isTimeout ? 504 : 500,
    body: {
      erro: isTimeout
        ? 'Tempo de resposta esgotado. Tente novamente.'
        : 'Erro interno ao processar a triagem.',
      cold_start: true,
      tentativas,
    },
  };
}

export async function pingClassification() {
  const inicioPing = Date.now();
  console.log(`[CLASS] Ping iniciado em ${new Date().toISOString()}`);
  console.log('Ping recebido — chamando classification service');
  try {
    const resposta = await getHealth();
    console.log(`[CLASS] Ping recebeu status=${resposta.status} em ${Date.now() - inicioPing}ms`);
    if (resposta.ok) {
      console.log('Classification service está acordado e respondendo!');
      return { acordado: true, mensagem: 'Serviço de classificação pronto!' };
    }
    console.log('Classification service ainda está acordando...');
    return { acordado: false, mensagem: 'Serviço de classificação está acordando...' };
  } catch {
    console.log('Classification service dormindo (ping falhou — esperado em cold start)');
    return { acordado: false, mensagem: 'Serviço de classificação dormindo, vai acordar em breve.' };
  }
}
