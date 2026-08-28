import { Router } from 'express';
import { chat } from '../controllers/chat.controller';
import { rateLimitChat } from '../middlewares/rate-limit.middleware';

const router = Router();

router.post('/chat', rateLimitChat, chat);

export default router;
