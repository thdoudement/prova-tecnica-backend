import cors from 'cors';
import express from 'express';
import noticiasRoutes from './routes/noticias.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/noticias', noticiasRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

export default app;
