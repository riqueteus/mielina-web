import { Router } from 'express';
import { prever } from '../controllers/classification.controller';

const router = Router();

router.post('/triagem/prever', prever);

export default router;
