import app from './app.js';
import { connectDB } from './config/db.js';
import { startPaymentCron } from './jobs/paymentCron.js';

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`✅ Server rodando na porta ${PORT}`));
    startPaymentCron();
  })
  .catch((err) => {
    console.error('❌ Falha ao conectar ao banco de dados:', err);
    process.exit(1);
  });
