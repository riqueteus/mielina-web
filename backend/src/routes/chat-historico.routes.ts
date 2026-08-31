import { Router } from 'express';
import { listarChat, salvarChat, limparChat } from '../controllers/chat-historico.controller';

const router = Router();

router.get('/chat/historico', listarChat);
router.post('/chat/historico', salvarChat);
router.delete('/chat/historico', limparChat);

export default router;
