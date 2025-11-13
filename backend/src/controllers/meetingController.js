import Meeting from "../models/Meeting.js";
import Member from "../models/Member.js";

/**
 * @desc Criar uma nova reunião
 * @route POST /api/meetings
 */
export const createMeeting = async (req, res) => {
  try {
    const { date, type, notes, members, location, durationMinutes } = req.body;

    if (!members || members.length < 2) {
      return res.status(400).json({ error: "Uma reunião precisa de pelo menos 2 membros." });
    }

    // Verifica se todos os membros existem
    const existingMembers = await Member.find({ _id: { $in: members } });
    if (existingMembers.length !== members.length) {
      return res.status(404).json({ error: "Um ou mais membros não foram encontrados." });
    }

    const meeting = await Meeting.create({
      date,
      type,
      notes,
      members,
      location,
      durationMinutes,
    });

    // Atualiza estatísticas dos membros
    for (const member of existingMembers) {
      member.stats.meetingsAttended += 1;
      await member.save();
    }

    res.status(201).json({
      message: "Reunião criada com sucesso",
      meeting,
    });
  } catch (error) {
    console.error("Erro ao criar reunião:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

/**
 * @desc Listar reuniões (opcional: filtrar por membro)
 * @route GET /api/meetings
 */
export const listMeetings = async (req, res) => {
  try {
    const { memberId } = req.query;
    const filter = memberId ? { members: memberId } : {};

    const meetings = await Meeting.find(filter)
      .populate("members", "name email")
      .sort({ date: -1 });

    res.json(meetings);
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
    if (!meeting) return res.status(404).json({ error: "Reunião não encontrada" });

    meeting.checkinStatus = "checked_in";
    await meeting.save();

    res.json({
      message: "Check-in realizado com sucesso",
      meeting,
    });
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
    if (!meeting) return res.status(404).json({ error: "Reunião não encontrada" });

    meeting.checkinStatus = status;
    await meeting.save();

    res.json({ message: "Status da reunião atualizado com sucesso", meeting });
  } catch (error) {
    console.error("Erro ao atualizar status da reunião:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};
