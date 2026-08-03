import { Request, Response } from 'express';

export function status(req: Request, res: Response) {
  res.json({
    status: 'online',
    mensagem: 'Servidor do Mielina funcionando perfeitamente!',
    timestamp: new Date(),
  });
}
