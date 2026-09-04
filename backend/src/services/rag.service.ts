import { postPergunta, getDocs } from '../clients/rag.client';

export async function chamarRAGComRetry(pergunta: string, tentativas = 3) {
  let ultimaErro: unknown;

  for (let tentativa = 1; tentativa <= tentativas; tentativa++) {
    try {
      console.log(`Tentativa ${tentativa}/${tentativas} de chamar o RAG...`);

      const resposta = await postPergunta(pergunta);

      if (!resposta.ok) {
        const erroTexto = await resposta.text();
        console.error(`Tentativa ${tentativa}: RAG retornou status ${resposta.status}`);

        if (tentativa < tentativas && resposta.status >= 500) {
          await new Promise((r) => setTimeout(r, 3000));
          continue;
        }

        return {
          ok: false,
          status: 502,
          body: {
            erro: 'Serviço de RAG indisponível no momento.',
            detalhe: erroTexto,
          },
        };
      }

      const dados = await resposta.json();
      return { ok: true, status: 200, body: dados };
    } catch (err: any) {
      ultimaErro = err;

      if (err.name === 'TimeoutError') {
        console.error(`Tentativa ${tentativa}: Timeout (120s). RAG provavelmente acordando...`);
      } else {
        console.error(`Tentativa ${tentativa}: Erro de rede - ${err.message || err}`);
      }

      if (tentativa < tentativas) {
        console.log(`Esperando 4s antes da próxima tentativa...`);
        await new Promise((r) => setTimeout(r, 4000));
      }
    }
  }

  const erro = ultimaErro as any;
  const isTimeout = erro?.name === 'TimeoutError';

  return {
    ok: false,
    status: isTimeout ? 504 : 500,
    body: {
      erro: isTimeout
        ? 'Tempo de resposta esgotado. Tente novamente.'
        : 'Erro interno ao processar sua pergunta.',
      cold_start: true,
      tentativas,
    },
  };
}

export async function pingRAG() {
  const inicioPing = Date.now();
  console.log(`[RAG] Ping iniciado em ${new Date().toISOString()}`);
  console.log('Ping recebido — chamando RAG');
  try {
    const resposta = await getDocs();
    console.log(`[RAG] Ping recebeu status=${resposta.status} em ${Date.now() - inicioPing}ms`);
    if (resposta.ok) {
      console.log('RAG está acordado e respondendo!');
      return { acordado: true, mensagem: 'Serviço de IA pronto!' };
    }
    console.log('RAG ainda está acordando...');
    return { acordado: false, mensagem: 'RAG está acordando...' };
  } catch {
    console.log('RAG dormindo (ping falhou — esperado em cold start)');
    return { acordado: false, mensagem: 'RAG dormindo, vai acordar em breve.' };
  }
}
