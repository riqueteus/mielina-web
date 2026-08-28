import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { PORT } from './env';
import { validarOrigem } from './middlewares/cors.middleware';
import { rateLimitGlobal } from './middlewares/rate-limit.middleware';
import routes from './routes';

const app = express();

app.set('trust proxy', 1);

app.use(cors({ origin: validarOrigem, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api', rateLimitGlobal, routes);

app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});

export { app };
