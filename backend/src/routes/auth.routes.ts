import { Router } from 'express';
import { salvarSessao, restaurarSessao, encerrarSessao } from '../controllers/auth.controller';

const router = Router();

router.post('/auth/sessao', salvarSessao);
router.get('/auth/sessao', restaurarSessao);
router.delete('/auth/sessao', encerrarSessao);

export default router;
