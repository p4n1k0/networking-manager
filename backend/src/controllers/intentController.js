import Intent from "../models/Intent.js";
import Invite from "../models/Invite.js";
import crypto from "crypto";

/**
 * Criar uma nova intenção
 */
export const createIntent = async (req, res) => {
  try {
    const { name, email, phone, business, message } = req.body;

    if (!name || !email || !phone || !business) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes" });
    }

    const intent = await Intent.create({
      name,
      email,
      phone,
      business,
      message,
      status: "pending",
    });

    res.status(201).json(intent);
  } catch (error) {
    console.error("Erro ao criar intent:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

/**
 * Listar intenções
 */
export const listIntents = async (req, res) => {
  try {
    const intents = await Intent.find().sort({ createdAt: -1 });
    res.json(intents);
  } catch (error) {
    console.error("Erro ao listar intents:", error);
    res.status(500).json({ error: "Erro ao buscar intents" });
  }
};

/**
 * Buscar uma intenção específica
 */
export const getIntentById = async (req, res) => {
  try {
    const intent = await Intent.findById(req.params.id);
    if (!intent) {
      return res.status(404).json({ error: "Intent não encontrada" });
    }
    res.json(intent);
  } catch (error) {
    console.error("Erro ao buscar intent:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

/**
 * Excluir intenção
 */
export const deleteIntent = async (req, res) => {
  try {
    const intent = await Intent.findByIdAndDelete(req.params.id);
    if (!intent) {
      return res.status(404).json({ error: "Intent não encontrada" });
    }

    // Remove convites associados
    await Invite.deleteMany({ intentionId: req.params.id });

    res.json({ message: "Intent removida com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir intent:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

/**
 * Atualizar status de intenção
 */
export const updateIntentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["approved", "rejected", "pending"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: "Status inválido" });
    }

    const intent = await Intent.findById(req.params.id);
    if (!intent) return res.status(404).json({ error: "Intent não encontrada" });

    intent.status = status;
    if (req.adminId) intent.approvedBy = req.adminId;
    await intent.save();

    if (status === "approved") {
      // Verificar convites ativos
      const alreadyInvite = await Invite.findOne({
        email: intent.email.toLowerCase(),
        status: "valid",
      });

      if (alreadyInvite) {
        return res.json({ intent, invite: alreadyInvite });
      }

      // Criar novo token seguro
      const token = crypto.randomBytes(32).toString("hex");

      const invite = await Invite.create({
        token,
        intentionId: intent._id,
        email: intent.email.toLowerCase(),
        status: "valid",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
      });

      return res.json({ intent, invite });
    }

    res.json({ intent });
  } catch (error) {
    console.error("Erro ao atualizar intent:", error);
    res.status(500).json({ error: "Erro interno" });
  }
};
