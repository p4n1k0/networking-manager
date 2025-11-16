
import Invite from "../models/Invite.js";

export const validateInviteToken = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) return res.status(400).json({ valid: false, message: "Token ausente" });

    const invite = await Invite.findOne({ token });
    if (!invite) return res.status(404).json({ valid: false, message: "Token não encontrado" });

    if (invite.status !== "valid") {
      return res.status(400).json({ valid: false, message: "Convite inválido" });
    }

    if (invite.expiresAt && invite.expiresAt < new Date()) {
      return res.status(400).json({ valid: false, message: "Token expirado" });
    }

    return res.json({
      valid: true,
      intentionEmail: invite.email,
      expiresAt: invite.expiresAt,
    });
  } catch (err) {
    console.error("Erro validateInviteToken:", err);
    return res.status(500).json({ valid: false, message: "Erro interno" });
  }
};
