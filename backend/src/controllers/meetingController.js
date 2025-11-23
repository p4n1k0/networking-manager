import Meeting from "../models/Meeting.js";
import Member from "../models/Member.js";

/**
 * Criar reunião 1-a-1
 * POST /api/meetings
 */
export const createMeeting = async (req, res) => {
  try {
    const { date, type, notes, members, location, durationMinutes } = req.body;

    if (!members || members.length !== 2) {
      return res.status(400).json({
        error: "Uma reunião 1-a-1 precisa de exatamente 2 membros."
      });
    }

    // garantir que os dois membros existem
    const existingMembers = await Member.find({ _id: { $in: members } });
    if (existingMembers.length !== 2) {
      return res.status(404).json({ error: "Membro não encontrado." });
    }

    const meeting = await Meeting.create({
      date,
      type,
      notes,
      members,
      location,
      durationMinutes,
    });

    return res.status(201).json({
      message: "Reunião criada com sucesso",
      meeting,
    });
  } catch (error) {
    console.error("Erro ao criar reunião:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};


/**
 * Listar reuniões por membro
 * GET /api/meetings/member/:id
 */
export const listMeetingsByMember = async (req, res) => {
  try {
    const memberId = req.params.id;

    if (!memberId)
      return res.status(400).json({ error: "ID do membro obrigatório" });

    // segurança básica
    if (req.user.role !== "admin" && req.user.id !== memberId) {
      return res.status(403).json({ error: "Acesso negado." });
    }

    const meetings = await Meeting.find({ members: memberId })
      .populate("members", "name email")
      .sort({ date: -1 });

    return res.json(meetings);
  } catch (error) {
    console.error("Erro ao listar reuniões:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

/**
 * @desc Fazer check-in em uma reunião
 * @route PATCH /api/meetings/:id/checkin
 */
export const checkinMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ error: "Reunião não encontrada" });
    }

    // apenas membros presentes podem fazer check-in
    if (!meeting.members.includes(req.user.id)) {
      return res.status(403).json({ error: "Você não participa desta reunião." });
    }

    meeting.checkinStatus = "checked_in";
    await meeting.save();

    res.json({ message: "Check-in realizado", meeting });
  } catch (error) {
    console.error("Erro ao fazer check-in:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};


/**
 * @desc Atualizar status da reunião
 * @route PATCH /api/meetings/:id/status
 */
export const updateMeetingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["scheduled", "checked_in", "missed"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Status inválido" });
    }

    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ error: "Reunião não encontrada" });
    }

    // 🔥 Apenas membros que participam da reunião podem alterar status
    if (!meeting.members.map(m => m.toString()).includes(req.user.id)) {
      return res.status(403).json({
        error: "Você não tem permissão para alterar esta reunião."
      });
    }

    meeting.checkinStatus = status;
    await meeting.save();

    res.json({ message: "Status atualizado", meeting });

  } catch (error) {
    console.error("Erro ao atualizar status da reunião:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};


/**
 * @desc Listar TODAS as reuniões
 * @route GET /api/admin/meetings
 * @access Admin
 */
export const adminListMeetings = async (req, res) => {
  try {
    const { memberId } = req.query;

    const filter = memberId ? { members: memberId } : {};

    const meetings = await Meeting.find(filter)
      .populate("members", "name email")
      .sort({ date: -1 });

    res.json(meetings);

  } catch (error) {
    console.error("Erro ao listar reuniões (admin):", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

/**
 * @desc Atualizar dados da reunião (admin)
 * @route PATCH /api/admin/meetings/:id
 */
export const adminUpdateMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ error: "Reunião não encontrada." });
    }

    const allowedFields = ["date", "notes", "location", "durationMinutes"];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        meeting[field] = req.body[field];
      }
    });

    await meeting.save();

    res.json({
      message: "Reunião atualizada com sucesso",
      meeting
    });

  } catch (error) {
    console.error("Erro ao atualizar reunião:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

/**
 * @desc Atualizar status
 * @route PATCH /api/admin/meetings/:id/status
 */
export const updateMeetingAdminStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["scheduled", "checked_in", "missed"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Status inválido" });
    }

    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ error: "Reunião não encontrada" });

    meeting.checkinStatus = status;
    await meeting.save();

    res.json({
      message: "Status atualizado com sucesso",
      meeting
    });

  } catch (error) {
    console.error("Erro ao atualizar status da reunião:", error);
    res.status(500).json({ error: "Erro interno" });
  }
};

/**
 * @desc Remover reunião
 * @route DELETE /api/admin/meetings/:id
 */
export const deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ error: "Reunião não encontrada." });
    }

    await meeting.deleteOne();

    res.json({ message: "Reunião removida com sucesso" });

  } catch (error) {
    console.error("Erro ao remover reunião:", error);
    res.status(500).json({ error: "Erro no servidor" });
  }
};
