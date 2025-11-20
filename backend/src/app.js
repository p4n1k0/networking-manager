import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import intentRoutes from './routes/intentRoutes.js';
import userRoutes from './routes/userRoutes.js';
import inviteRoutes from './routes/inviteRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import referralRoutes from './routes/referralRoutes.js';
import meetingRoutes from './routes/meetingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import { errorHandler } from './middlewares/errorMiddleware.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();

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
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/meetings', adminRoutes);

// Middleware de erros
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('🚀 API do Networking Manager rodando!');
});

export default app;
