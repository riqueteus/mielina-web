import { Router } from 'express';
import authRoutes from './auth.routes';
import statusRoutes from './status.routes';
import pingRoutes from './ping.routes';
import chatRoutes from './chat.routes';
import classificationRoutes from './classification.routes';
import laudoRoutes from './laudo.routes';
import { autenticar } from '../middlewares/auth.middleware';

const router = Router();

router.use(authRoutes);
router.use(statusRoutes);
router.use(pingRoutes);

// A partir daqui, TODAS as rotas exigem token de autenticação
router.use(autenticar);

router.use(chatRoutes);
router.use(classificationRoutes);
router.use(laudoRoutes);

export default router;
