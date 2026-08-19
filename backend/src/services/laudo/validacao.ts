import type { LaudoEstruturado, RespostaExtrairLaudo } from '../../types/laudo.types';

export function validarRespostaLaudoService(
  corpo: unknown
): { valido: boolean; resultado?: LaudoEstruturado; erros: string[] } {
  if (!corpo || typeof corpo !== 'object') {
    return { valido: false, erros: ['Resposta do laudo-service não é um JSON válido.'] };
  }

  const resultado = (corpo as RespostaExtrairLaudo).resultado;

  if (!resultado || typeof resultado !== 'object') {
    return { valido: false, erros: ['Campo "resultado" ausente na resposta do laudo-service.'] };
  }

  const identificacao = resultado.identificacao_protocolo;

  if (!identificacao || typeof identificacao !== 'object') {
    return { valido: false, erros: ['Campo "identificacao_protocolo" ausente na resposta.'] };
  }

  if (!Array.isArray(resultado.lesoes)) {
    return { valido: false, erros: ['Campo "lesoes" deve ser um array.'] };
  }

  const dataExame = identificacao.data_exame;
  if (dataExame !== null && (typeof dataExame !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dataExame))) {
    return { valido: false, erros: ['"data_exame" deve ser texto no formato AAAA-MM-DD ou null.'] };
  }

  return { valido: true, resultado, erros: [] };
}