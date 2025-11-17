import Invite from "../models/Invite.js";

export const validateInviteToken = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) return res.status(400).json({ valid: false, message: "Token ausente" });

    const invite = await Invite.findOne({ token });
    if (!invite) return res.status(404).json({ valid: false, message: "Convite não encontrado" });

    if (invite.status !== "valid") {
      return res.status(400).json({ valid: false, message: "Convite já utilizado ou inválido" });
    }

    if (invite.expiresAt && invite.expiresAt < new Date()) {
      return res.status(400).json({ valid: false, message: "Convite expirado" });
    }

    return res.json({
      valid: true,
      intentionEmail: invite.email,
      expiresAt: invite.expiresAt,
    });
  } catch (err) {
    console.error("Erro ao validar invite:", err);
    return res.status(500).json({ valid: false, message: "Erro interno" });
  }
};
