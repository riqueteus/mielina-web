import { Router } from 'express';
import { pingRag } from '../controllers/ping-rag.controller';

const router = Router();

router.get('/ping-rag', pingRag);

export default router;
