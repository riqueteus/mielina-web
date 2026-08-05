import { Router } from 'express';
import statusRoutes from './status.routes';
import chatRoutes from './chat.routes';
import classificationRoutes from './classification.routes';
import pingRoutes from './ping.routes';

const router = Router();

router.use(statusRoutes);
router.use(chatRoutes);
router.use(classificationRoutes);
router.use(pingRoutes);

export default router;
