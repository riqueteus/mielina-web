import { Router } from 'express';
import { salvarSessao, restaurarSessao, encerrarSessao } from '../controllers/auth.controller';
import { rateLimitAuth } from '../middlewares/rate-limit.middleware';

const router = Router();

router.post('/auth/sessao', rateLimitAuth, salvarSessao);
router.get('/auth/sessao', rateLimitAuth, restaurarSessao);
router.delete('/auth/sessao', rateLimitAuth, encerrarSessao);

export default router;
