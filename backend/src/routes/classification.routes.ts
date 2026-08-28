import { Router } from 'express';
import { prever } from '../controllers/classification.controller';
import { rateLimitTriagem } from '../middlewares/rate-limit.middleware';

const router = Router();

router.post('/triagem/prever', rateLimitTriagem, prever);

export default router;
