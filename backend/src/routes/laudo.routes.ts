import { NextFunction, Request, Response, Router } from 'express';
import multer from 'multer';
import { autenticar } from '../middlewares/auth.middleware';
import {
  distribuicaoRegioes,
  evolucaoLesoes,
  excluir,
  listar,
  uploadLaudo,
} from '../controllers/laudo.controller';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
});

function uploadUnico(campo: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    upload.single(campo)(req, res, (err: unknown) => {
      if (err) {
        const ehLimite = (err as { code?: string })?.code === 'LIMIT_FILE_SIZE';
        const status = ehLimite ? 413 : 400;
        return res.status(status).json({
          erro: ehLimite
            ? 'Arquivo muito grande. O limite é de 15 MB.'
            : 'Falha ao ler o arquivo enviado.',
        });
      }
      next();
    });
  };
}

router.post('/laudos', autenticar, uploadUnico('arquivo'), uploadLaudo);
router.get('/laudos', autenticar, listar);
router.delete('/laudos/:id', autenticar, excluir);
router.get('/laudos/grafico/evolucao-lesoes', autenticar, evolucaoLesoes);
router.get('/laudos/grafico/distribuicao-regioes', autenticar, distribuicaoRegioes);

export default router;
