import { extrairLaudoDoPdf, getHealth } from '../../clients/laudo.client';
import type { LaudoEstruturado } from '../../types/laudo.types';
import { ErroLaudo } from './erros';
import { validarRespostaLaudoService } from './validacao';

export async function extrairLaudo(arquivo: Buffer, nomeArquivo: string) {
  let resposta: Response;

  try {
    resposta = await extrairLaudoDoPdf(arquivo, nomeArquivo);
  } catch (err: any) {
    if (err?.name === 'TimeoutError') {
      throw new ErroLaudo(504, 'Tempo de resposta do serviço de laudos esgotado.', err);
    }
    throw new ErroLaudo(502, 'Serviço de laudos indisponível no momento.', err);
  }

  if (resposta.status === 400) {
    let detalhe = '';
    try {
      detalhe = JSON.stringify(await resposta.json());
    } catch {
      detalhe = await resposta.text().catch(() => '');
    }
    throw new ErroLaudo(422, 'Não foi possível extrair o texto do PDF.', detalhe);
  }

  if (resposta.status === 502) {
    let detalhe = '';
    try {
      detalhe = JSON.stringify(await resposta.json());
    } catch {
      detalhe = await resposta.text().catch(() => '');
    }
    throw new ErroLaudo(502, 'A IA de extração de laudos falhou ao processar o PDF.', detalhe);
  }

  if (!resposta.ok) {
    throw new ErroLaudo(502, 'Serviço de laudos retornou erro inesperado.', resposta.status);
  }

  let corpo: unknown;
  try {
    corpo = await resposta.json();
  } catch {
    throw new ErroLaudo(422, 'Resposta do laudo-service não é um JSON válido.');
  }

  const validacao = validarRespostaLaudoService(corpo);
  if (!validacao.valido) {
    throw new ErroLaudo(422, validacao.erros.join(' '), corpo);
  }

  return validacao.resultado as LaudoEstruturado;
}

export async function pingLaudo() {
  console.log('Ping recebido — chamando laudo service');
  try {
    const resposta = await getHealth();
    if (resposta.ok) {
      console.log('Laudo service está acordado e respondendo!');
      return { acordado: true, mensagem: 'Serviço de laudos pronto!' };
    }
    console.log('Laudo service ainda está acordando...');
    return { acordado: false, mensagem: 'Serviço de laudos está acordando...' };
  } catch {
    console.log('Laudo service dormindo (ping falhou — esperado em cold start)');
    return { acordado: false, mensagem: 'Serviço de laudos dormindo, vai acordar em breve.' };
  }
}