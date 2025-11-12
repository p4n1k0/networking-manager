import Invite from "../models/Invite.js";
import Member from "../models/Member.js";

/**
 * @desc Cadastrar novo membro a partir de um convite válido
 * @route POST /api/members
 * @access Público (com token válido)
 */
export const registerMember = async (req, res) => {
  try {
    const { token, name, email, phone, business, company, position, linkedin } = req.body;

    // Verifica o convite
    const invite = await Invite.findOne({ token });
    if (!invite) {
      return res.status(404).json({ error: "Convite não encontrado" });
    }

    if (invite.status !== "valid" || invite.expiresAt < new Date()) {
      return res.status(400).json({ error: "Convite inválido ou expirado" });
    }

    // Cria membro
    const member = await Member.create({
      name,
      email,
      phone,
      business,
      profile: { company, position, linkedin },
    });

    // Marca o convite como usado
    invite.status = "used";
    await invite.save();

    res.status(201).json({
      message: "Membro cadastrado com sucesso",
      memberId: member._id,
      status: member.status,
      joinedAt: member.joinedAt,
    });
  } catch (error) {
    console.error("Erro ao registrar membro:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

/**
 * @desc Listar todos os membros
 * @route GET /api/members
 * @access Admin
 */
export const listMembers = async (req, res) => {
  try {
    const members = await Member.find().sort({ joinedAt: -1 });
    res.json(members);
  } catch (error) {
    console.error("Erro ao listar membros:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

/**
 * @desc Buscar membro por ID
 * @route GET /api/members/:id
 * @access Admin
 */
export const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ error: "Membro não encontrado" });

    res.json(member);
  } catch (error) {
    console.error("Erro ao buscar membro:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};
