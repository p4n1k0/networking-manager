import cron from "node-cron";
import Payment from "../models/Payment.js";

/**
 * Cron job que roda a cada 10 minutos
 * e marca pagamentos vencidos como "overdue"
 */
export const startPaymentCron = () => {
  cron.schedule("*/10 * * * *", async () => {
    console.log("⏰ Verificando pagamentos vencidos...");

    try {
      const today = new Date();
      const result = await Payment.updateMany(
        { dueDate: { $lt: today }, status: "pending" },
        { $set: { status: "overdue" } }
      );

      if (result.modifiedCount > 0) {
        console.log(`⚠️ ${result.modifiedCount} pagamento(s) marcados como vencidos.`);
      } else {
        console.log("✅ Nenhum pagamento pendente vencido.");
      }
    } catch (error) {
      console.error("❌ Erro ao atualizar pagamentos vencidos:", error);
    }
  });
};
