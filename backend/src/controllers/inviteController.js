import { v4 as uuidv4 } from "uuid";
import Invite from "../models/Invite.js";
import Intent from "../models/Intent.js";

/**
 * @desc Aprovar uma intenção e gerar um convite
 * @route POST /api/invites/:intentId/approve
 * @access Admin
 */
export const approveIntent = async (req, res) => {
  try {
    const { intentId } = req.params;

    // Verifica se a intenção existe
    const intent = await Intent.findById(intentId);
    if (!intent) {
      return res.status(404).json({ error: "Intenção não encontrada" });
    }

    // Atualiza status da intenção
    intent.status = "approved";
    await intent.save();

    // Gera token e cria convite
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // expira em 7 dias

    const invite = await Invite.create({
      token,
      intentionId: intent._id,
      email: intent.email,
      status: "valid",
      expiresAt,
    });

    res.status(201).json({
      message: "Convite gerado com sucesso",
      invite,
    });
  } catch (error) {
    console.error("Erro ao aprovar intenção:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

/**
 * @desc Validar um token de convite
 * @route GET /api/invites/:token/validate
 * @access Public
 */
export const validateInvite = async (req, res) => {
  try {
    const { token } = req.params;

    const invite = await Invite.findOne({ token });
    if (!invite) {
      return res.status(404).json({ valid: false, error: "Convite não encontrado" });
    }

    if (invite.status !== "valid" || invite.expiresAt < new Date()) {
      return res.status(400).json({ valid: false, error: "Convite expirado ou inválido" });
    }

    res.json({
      valid: true,
      email: invite.email,
      expiresAt: invite.expiresAt,
    });
  } catch (error) {
    console.error("Erro ao validar convite:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

/**
 * @desc Listar convites (admin)
 * @route GET /api/invites
 * @access Admin
 */
export const listInvites = async (req, res) => {
  try {
    const invites = await Invite.find()
      .populate("intentionId", "name email status")
      .sort({ createdAt: -1 });

    res.json(invites);
  } catch (error) {
    console.error("Erro ao listar convites:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};
