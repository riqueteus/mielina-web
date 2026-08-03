import { Router } from 'express';
import statusRoutes from './status.routes';
import chatRoutes from './chat.routes';
import pingRagRoutes from './ping-rag.routes';

const router = Router();

router.use(statusRoutes);
router.use(chatRoutes);
router.use(pingRagRoutes);

export default router;
