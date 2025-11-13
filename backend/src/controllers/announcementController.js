import { Announcement } from "../models/Announcement.js";

// Criar comunicado
export const createAnnouncement = async (req, res) => {
  try {
    const { title, content, authorId, visibleTo } = req.body;
    const announcement = await Announcement.create({ title, content, authorId, visibleTo });
    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar comunicado", error: error.message });
  }
};

// Listar comunicados
export const listAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar comunicados" });
  }
};
