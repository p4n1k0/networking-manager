import Payment from "../models/Payment.js";
import Member from "../models/Member.js";

/**
 * @desc Criar novo pagamento
 * @route POST /api/payments
 */
export const createPayment = async (req, res) => {
  try {
    const { memberId, amount, dueDate, method, notes } = req.body;

    const member = await Member.findById(memberId);
    if (!member) return res.status(404).json({ error: "Membro não encontrado" });

    const payment = await Payment.create({
      member: memberId,
      amount,
      dueDate,
      method,
      notes,
    });

    res.status(201).json({ message: "Pagamento criado com sucesso", payment });
  } catch (error) {
    console.error("Erro ao criar pagamento:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

/**
 * @desc Listar pagamentos (opcional: filtrar por membro)
 * @route GET /api/payments
 */
export const listPayments = async (req, res) => {
  try {
    const { memberId } = req.query;
    const filter = memberId ? { member: memberId } : {};

    const payments = await Payment.find(filter)
      .populate("member", "name email")
      .sort({ dueDate: -1 });

    res.json(payments);
  } catch (error) {
    console.error("Erro ao listar pagamentos:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

/**
 * @desc Marcar pagamento como pago
 * @route PATCH /api/payments/:id/pay
 */
export const markAsPaid = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ error: "Pagamento não encontrado" });

    payment.status = "paid";
    payment.paidAt = new Date();
    await payment.save();

    res.json({ message: "Pagamento marcado como pago", payment });
  } catch (error) {
    console.error("Erro ao atualizar pagamento:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

/**
 * @desc Atualizar status manualmente (caso necessário)
 * @route PATCH /api/payments/:id/status
 */
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ["pending", "paid", "overdue"];
    if (!valid.includes(status)) {
      return res.status(400).json({ error: "Status inválido" });
    }

    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ error: "Pagamento não encontrado" });

    payment.status = status;
    if (status === "paid") payment.paidAt = new Date();
    await payment.save();

    res.json({ message: "Status atualizado com sucesso", payment });
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

/**
 * @desc Listar pagamentos atrasados
 * @route GET /api/payments/overdue
 */
export const listOverduePayments = async (req, res) => {
  try {
    const today = new Date();
    const overdue = await Payment.find({
      dueDate: { $lt: today },
      status: { $ne: "paid" },
    }).populate("member", "name email");

    res.json(overdue);
  } catch (error) {
    console.error("Erro ao listar pagamentos atrasados:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};
