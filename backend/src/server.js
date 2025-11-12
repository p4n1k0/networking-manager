import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api', userRoutes);

// Conecta ao banco
connectDB();

// Rotas de teste
app.get('/', (req, res) => {
  res.send('API do Networking Manager rodando 🚀');
});

// Inicia o servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
