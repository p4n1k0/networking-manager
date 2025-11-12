import Referral from "../models/Referral.js";
import Member from "../models/Member.js";

/**
 * @desc Criar uma nova indicação
 * @route POST /api/referrals
 * @access Membro autenticado (ou pública por enquanto)
 */
export const createReferral = async (req, res) => {
  try {
    const { fromMemberId, toMemberId, clientName, businessType, description } = req.body;

    // Verifica se os membros existem
    const fromMember = await Member.findById(fromMemberId);
    const toMember = await Member.findById(toMemberId);

    if (!fromMember || !toMember) {
      return res.status(404).json({ error: "Um ou ambos os membros não foram encontrados" });
    }

    // Cria a referência
    const referral = await Referral.create({
      fromMemberId,
      toMemberId,
      clientName,
      businessType,
      description,
    });

    // Atualiza estatísticas dos membros
    fromMember.stats.referralsSent += 1;
    toMember.stats.referralsReceived += 1;
    await fromMember.save();
    await toMember.save();

    res.status(201).json({
      message: "Indicação registrada com sucesso",
      referral,
    });
  } catch (error) {
    console.error("Erro ao criar indicação:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

/**
 * @desc Listar todas as indicações
 * @route GET /api/referrals
 */
export const listReferrals = async (req, res) => {
  try {
    const referrals = await Referral.find()
      .populate("fromMemberId", "name email")
      .populate("toMemberId", "name email")
      .sort({ createdAt: -1 });

    res.json(referrals);
  } catch (error) {
    console.error("Erro ao listar indicações:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

/**
 * @desc Atualizar status de uma indicação
 * @route PATCH /api/referrals/:id/status
 */
export const updateReferralStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["in_progress", "won", "lost"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Status inválido" });
    }

    const referral = await Referral.findById(req.params.id);
    if (!referral) return res.status(404).json({ error: "Indicação não encontrada" });

    referral.status = status;
    await referral.save();

    res.json({ message: "Status atualizado com sucesso", referral });
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};
