import Referral from "../models/Referral.js";
import Member from "../models/Member.js";

/**
 * @desc Criar uma nova indicação
 * @route POST /api/referrals
 */
export const createReferral = async (req, res) => {
  try {
    // agora é sempre o membro logado — não vem mais do body!
    const fromMemberId = req.user.id;
    const { toMemberId, clientName, businessType, description } = req.body;

    if (!toMemberId || !clientName) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes." });
    }

    if (fromMemberId === toMemberId) {
      return res.status(400).json({
        error: "Um membro não pode enviar uma indicação para si mesmo."
      });
    }

    const [fromMember, toMember] = await Promise.all([
      Member.findById(fromMemberId),
      Member.findById(toMemberId)
    ]);

    if (!fromMember || !toMember) {
      return res.status(404).json({
        error: "Um ou ambos os membros não foram encontrados."
      });
    }

    const referral = await Referral.create({
      fromMemberId,
      toMemberId,
      clientName,
      businessType,
      description
    });

    fromMember.stats.referralsSent += 1;
    toMember.stats.referralsReceived += 1;

    await Promise.all([fromMember.save(), toMember.save()]);

    return res.status(201).json({
      message: "Indicação registrada com sucesso",
      referral
    });

  } catch (error) {
    console.error("Erro ao criar indicação:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};

/**
 * @desc Listar todas as indicações
 * @route GET /api/referrals
 */
export const listReferrals = async (req, res) => {
  try {
    const { memberId, type } = req.query;

    let filter = {};

    if (memberId && type === "sent") {
      filter.fromMemberId = memberId;
    }

    if (memberId && type === "received") {
      filter.toMemberId = memberId;
    }

    const referrals = await Referral.find(filter)
      .populate("fromMemberId", "name email")
      .populate("toMemberId", "name email")
      .sort({ createdAt: -1 });

    return res.json(referrals);

  } catch (error) {
    console.error("Erro ao listar indicações:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};


/**
 * @desc Listar todas as indicações de um membro
 * @route GET /api/referrals
 */
export const listReferralsByMember = async (req, res) => {
  try {
    const memberId = req.user.id;

    const sent = await Referral.find({ fromMemberId: memberId })
      .populate("toMemberId", "name email business")
      .sort({ createdAt: -1 });

    const received = await Referral.find({ toMemberId: memberId })
      .populate("fromMemberId", "name email business")
      .sort({ createdAt: -1 });

    return res.json({ sent, received });

  } catch (error) {
    console.error("Erro ao listar indicações do membro:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};


/**
 * @desc Atualizar status de uma indicação
 * @route PATCH /api/referrals/:id/status
 * @access Admin
 */
export const updateReferralStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["in_progress", "won", "lost"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Status inválido." });
    }

    const referral = await Referral.findById(req.params.id);
    if (!referral)
      return res.status(404).json({ error: "Indicação não encontrada." });

    referral.status = status;
    await referral.save();

    return res.json({
      message: "Status atualizado com sucesso",
      referral
    });

  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export const updateReferralValue = async (req, res) => {
  try {
    const { estimatedValue } = req.body;

    if (typeof estimatedValue !== "number") {
      return res.status(400).json({ error: "Valor inválido." });
    }

    const referral = await Referral.findById(req.params.id);
    if (!referral)
      return res.status(404).json({ error: "Indicação não encontrada" });

    referral.estimatedValue = estimatedValue;
    await referral.save();

    return res.json({
      message: "Valor estimado atualizado com sucesso",
      referral
    });

  } catch (error) {
    console.error("Erro ao atualizar valor:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const updateReferralFeedback = async (req, res) => {
  try {
    const { feedback } = req.body;

    if (!feedback || feedback.length < 3) {
      return res.status(400).json({ error: "Feedback muito curto." });
    }

    const referral = await Referral.findById(req.params.id);
    if (!referral)
      return res.status(404).json({ error: "Indicação não encontrada" });

    // permitir apenas se o membro é o dono da indicação
    if (referral.toMemberId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Você não pode alterar esta indicação." });
    }

    referral.feedback = feedback;
    await referral.save();

    return res.json({
      message: "Feedback registrado com sucesso",
      referral
    });

  } catch (error) {
    console.error("Erro ao atualizar feedback:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

