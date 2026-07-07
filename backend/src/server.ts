import express from 'express';

const app = express();
const PORT = 3001; 

app.use(express.json());

app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    mensagem: 'Servidor do Mielina funcionando perfeitamente!',
    timestamp: new Date()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor Mielina rodando em http://localhost:${PORT}`);
});
