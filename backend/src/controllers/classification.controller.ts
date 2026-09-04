import { Request, Response } from 'express';
import { preverComRetry } from '../services/classification.service';
import { CLASSIFICATION_SERVICE_URL } from '../env';

const CAMPOS_OBRIGATORIOS = [
  'Gender',
  'Age',
  'Schooling',
  'Breastfeeding',
  'Varicella',
  'Initial_Symptom',
  'Mono_or_Polysymptomatic',
  'Oligoclonal_Bands',
  'LLSSEP',
  'ULSSEP',
  'VEP',
  'BAEP',
  'Periventricular_MRI',
  'Cortical_MRI',
  'Infratentorial_MRI',
  'Spinal_Cord_MRI',
] as const;

export async function prever(req: Request, res: Response) {
  const corpo = req.body;
  console.log(`[BACKEND] ${new Date().toISOString()} - rota POST /api/triagem/prever; campos=${corpo && typeof corpo === 'object' ? Object.keys(corpo).length : 'inválido'}`);

  if (!corpo || typeof corpo !== 'object') {
    return res.status(400).json({ erro: 'Corpo da requisição é obrigatório.' });
  }

  const camposFaltando = CAMPOS_OBRIGATORIOS.filter((c) => corpo[c] === undefined || corpo[c] === null);
  if (camposFaltando.length > 0) {
    return res.status(400).json({
      erro: `Campos obrigatórios faltando: ${camposFaltando.join(', ')}`,
    });
  }

  if (typeof corpo.Age !== 'number' || corpo.Age < 0 || corpo.Age > 120) {
    return res.status(400).json({ erro: 'Age deve ser um número entre 0 e 120.' });
  }

  const dados: Record<string, number> = {};
  for (const campo of CAMPOS_OBRIGATORIOS) {
    dados[campo] = Number(corpo[campo]);
  }

  console.log(`Triagem recebida — encaminhando para ${CLASSIFICATION_SERVICE_URL}/classification/prever`);

  const resultado = await preverComRetry(dados);
  console.log(`[BACKEND] ${new Date().toISOString()} - retorno do Classification para POST /api/triagem/prever; status=${resultado.status}; ok=${resultado.ok}`);

  if (resultado.ok) {
    console.log('Classification service respondeu com sucesso!');
    return res.json(resultado.body);
  }

  console.error(`Todas as tentativas falharam. Status: ${resultado.status}`);
  return res.status(resultado.status).json(resultado.body);
}
