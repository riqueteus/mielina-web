import express from 'express';
import cors from 'cors';
import { PORT } from './env';
import { validarOrigem } from './middlewares/cors.middleware';
import routes from './routes';

const app = express();

app.use(cors({ origin: validarOrigem, credentials: false }));
app.use(express.json());

app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});

export { app };
