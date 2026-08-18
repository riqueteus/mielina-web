import { Router } from 'express';
import statusRoutes from './status.routes';
import chatRoutes from './chat.routes';
import classificationRoutes from './classification.routes';
import pingRoutes from './ping.routes';
import laudoRoutes from './laudo.routes';

const router = Router();

router.use(statusRoutes);
router.use(chatRoutes);
router.use(classificationRoutes);
router.use(pingRoutes);
router.use(laudoRoutes);

export default router;
