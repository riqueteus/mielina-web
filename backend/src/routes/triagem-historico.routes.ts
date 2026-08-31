import { Router } from 'express';
import { listarTriagemHistorico, salvarTriagemHistorico } from '../controllers/triagem-historico.controller';

const router = Router();

router.get('/triagem/historico', listarTriagemHistorico);
router.post('/triagem/historico', salvarTriagemHistorico);

export default router;
