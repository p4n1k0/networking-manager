import Meeting from "../models/Meeting.js";
import Member from "../models/Member.js";

/**
 * @desc Criar uma nova reunião
 * @route POST /api/meetings
 */
/**
 * Criar reunião 1:1 entre membros
 * POST /api/meetings
 */
export const createMeeting = async (req, res) => {
  try {
    const loggedMemberId = req.user.id;
    const { partnerId, date, notes, location, durationMinutes } = req.body;

    if (!partnerId || !date) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes." });
    }

    if (loggedMemberId === partnerId) {
      return res.status(400).json({
        error: "Você não pode criar uma reunião consigo mesmo.",
      });
    }

    // garante que existem
    const partner = await Member.findById(partnerId);
    if (!partner) {
      return res.status(404).json({ error: "Membro convidado não existe." });
    }

    // monta lista segura
    const members = [loggedMemberId, partnerId];

    const meeting = await Meeting.create({
      date,
      type: "one_to_one",
      notes,
      members,
      location,
      durationMinutes,
    });

    // atualiza estatísticas
    await Member.updateMany(
      { _id: { $in: members } },
      { $inc: { "stats.meetingsAttended": 1 } }
    );

    return res.status(201).json({
      message: "Reunião 1 a 1 criada com sucesso",
      meeting,
    });
  } catch (error) {
    console.error("Erro ao criar reunião:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};


/**
 * Listar reuniões de um membro
 * GET /api/meetings/member/:id
 */
export const listMeetingsByMember = async (req, res) => {
  try {
    const memberId = req.params.id;

    if (!memberId) {
      return res.status(400).json({ error: "ID do membro é obrigatório." });
    }

    // segurança: só o próprio membro ou admin pode ver
    if (req.user.role !== "admin" && req.user.id !== memberId) {
      return res.status(403).json({ error: "Acesso negado." });
    }

    const meetings = await Meeting.find({ members: memberId })
      .populate("members", "name email")
      .sort({ date: -1 });

    return res.json(meetings);
  } catch (error) {
    console.error("Erro ao listar reuniões do membro:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
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

    meeting.checkinStatus = status;
    await meeting.save();

    res.json({ message: "Status atualizado", meeting });
  } catch (error) {
    console.error("Erro ao atualizar status da reunião:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

