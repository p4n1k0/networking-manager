import Payment from "../models/Payment.js";
import Member from "../models/Member.js";

/**
 * Criar pagamento
 * - Membro logado: cria para si mesmo
 * - Admin: cria para outro membro, precisa enviar memberId
 */
export const createPayment = async (req, res) => {
  try {
    const { amount, dueDate, method, notes, memberId } = req.body;

    let targetMemberId = memberId;

    // Se não for admin, ignora qualquer memberId enviado
    if (!req.user.isAdmin) {
      targetMemberId = req.user.id;
    }

    const member = await Member.findById(targetMemberId);
    if (!member) return res.status(404).json({ error: "Membro não encontrado" });

    const payment = await Payment.create({
      member: targetMemberId,
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
 * Admin: listar pagamentos de qualquer membro
 */
export const listPayments = async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ error: "Acesso negado" });

    const { memberId } = req.query;
    const filter = memberId ? { member: memberId } : {};
    const payments = await Payment.find(filter).populate("member", "name email").sort({ dueDate: -1 });
    res.json(payments);
  } catch (error) {
    console.error("Erro ao listar pagamentos:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

/**
 * Listar pagamentos do membro logado
 */
export const listMyPayments = async (req, res) => {
  try {
    const memberId = req.user.id;
    const payments = await Payment.find({ member: memberId }).sort({ dueDate: 1 });
    res.json(payments);
  } catch (error) {
    console.error("Erro ao listar pagamentos pessoais:", error);
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
 * @desc Atualizar status manualmente
 * @route PATCH /api/payments/:id/status
 */
export async function updateStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "paid", "overdue"].includes(status)) {
      return res.status(400).json({ error: "Status inválido." });
    }

    const payment = await Payment.findById(id);

    if (!payment) {
      return res.status(404).json({ error: "Pagamento não encontrado." });
    }

    payment.status = status;

    if (status === "paid") {
      payment.paidAt = new Date();
    }

    if (status !== "paid") {
      payment.paidAt = null;
    }

    await payment.save();

    return res.json({ message: "Status atualizado com sucesso!", payment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao atualizar status." });
  }
}

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
    console.error("Erro ao listar atrasados:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};


/** * @desc Listar todos os pagamentos (admin)
 * @route GET /api/admin/payments
 * @access Admin
 */
export const adminListPayments = async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ error: "Acesso negado" });

    const { memberId } = req.query;
    const filter = memberId ? { member: memberId } : {};
    const payments = await Payment.find(filter).populate("member", "name email").sort({ dueDate: -1 });
    res.json(payments);
  } catch (error) {
    console.error("Erro ao listar pagamentos (admin):", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};
