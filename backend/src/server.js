import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import intentRoutes from './routes/intentRoutes.js';
import userRoutes from './routes/userRoutes.js';
import inviteRoutes from './routes/inviteRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import referralRoutes from './routes/referralRoutes.js';
import meetingRoutes from './routes/meetingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import { startPaymentCron } from './jobs/paymentCron.js';
import announcementRoutes from './routes/announcementRoutes.js';
import healthRoutes from './routes/healthRoutes.js';


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/intents', intentRoutes);
app.use('/api', userRoutes);
app.use('/api/invites', inviteRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/health', healthRoutes);

// Teste rápido
app.get('/', (req, res) => {
  res.send('🚀 API do Networking Manager rodando!');
});

// Conecta ao banco antes de subir o servidor
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`✅ Server rodando na porta ${PORT}`));
    // Inicia o cron job para pagamentos
    startPaymentCron();
  })
  .catch((err) => {
    console.error('❌ Falha ao conectar ao banco de dados:', err);
    process.exit(1);
  });


