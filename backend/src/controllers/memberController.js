import Invite from "../models/Invite.js";
import Member from "../models/Member.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * @desc Cadastrar novo membro a partir de um convite válido
 * @route POST /api/members
 * @access Público (com token de convite)
 */
export const registerMember = async (req, res) => {
  try {
    const {
      token,
      name,
      email,
      phone,
      business,
      password,
      company,
      position,
      linkedin,
    } = req.body;

    // 📌 1. Verificação de campos obrigatórios
    if (!token || !name || !email || !phone || !business || !password) {
      return res.status(400).json({ error: "Campos obrigatórios faltando." });
    }

    // 📌 2. Verificação do convite
    const invite = await Invite.findOne({ token });
    if (!invite)
      return res.status(404).json({ error: "Convite não encontrado." });

    if (invite.status !== "valid")
      return res.status(400).json({ error: "Convite já foi usado ou está inválido." });

    if (invite.expiresAt && invite.expiresAt < new Date())
      return res.status(400).json({ error: "Convite expirado." });

    // 📌 3. Normalização do e-mail
    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = await Member.findOne({ email: normalizedEmail });

    if (existing)
      return res.status(409).json({ error: "E-mail já cadastrado." });

    // 📌 4. Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // 📌 5. Criação do membro
    const member = await Member.create({
      name,
      email: normalizedEmail,
      phone,
      business,
      password: hashedPassword,
      profile: {
        company: company || "",
        position: position || "",
        linkedin: linkedin || "",
      },
      role: "member",
      status: "active",
    });

    // 📌 6. Atualiza convite somente após sucesso
    await Invite.updateOne(
      { token },
      {
        $set: {
          status: "used",
          usedBy: member._id,
          usedAt: new Date(),
        },
      }
    );

    return res.status(201).json({
      message: "Membro cadastrado com sucesso.",
      memberId: member._id,
      joinedAt: member.joinedAt,
    });
  } catch (err) {
    console.error("Erro ao registrar membro:", err);

    // 📌 Tratamento de duplicidade Mongo
    if (err?.code === 11000) {
      return res.status(409).json({ error: "E-mail já cadastrado." });
    }

    return res
      .status(500)
      .json({ error: "Erro interno do servidor. Tente novamente mais tarde." });
  }
};


/**
 * @desc Logar membro
 * @route POST /api/members/login
 * @access Public
 */
export const memberLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar membro ativo
    const member = await Member.findOne({ email: email.toLowerCase(), status: "active" });
    if (!member) {
      return res.status(404).json({ message: "Membro não encontrado ou inativo" });
    }

    // Verificar senha
    const passwordMatch = await bcrypt.compare(password, member.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Senha incorreta" });
    }

    // Gera token
    const token = jwt.sign(
      { id: member._id, role: "member" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, member });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro no login" });
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
