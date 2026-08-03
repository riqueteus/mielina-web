import { Request, Response } from 'express';
import { chamarRAGComRetry } from '../services/rag.service';
import { RAG_SERVICE_URL } from '../env';

export async function chat(req: Request, res: Response) {
  const { pergunta } = req.body;

  if (!pergunta || typeof pergunta !== 'string' || !pergunta.trim()) {
    return res.status(400).json({ erro: 'Campo "pergunta" é obrigatório.' });
  }

  console.log(`Pergunta recebida: "${pergunta}"`);
  console.log(`Encaminhando para RAG em ${RAG_SERVICE_URL}/pergunta`);

  const resultado = await chamarRAGComRetry(pergunta);

  if (resultado.ok) {
    console.log('RAG respondeu com sucesso!');
    return res.json(resultado.body);
  }

  console.error(`Todas as tentativas falharam. Status: ${resultado.status}`);
  return res.status(resultado.status).json(resultado.body);
}
