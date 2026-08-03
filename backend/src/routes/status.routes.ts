import { Router } from 'express';
import { status } from '../controllers/status.controller';

const router = Router();

router.get('/status', status);

export default router;
