import Intent from "../models/Intent.js";

/**
 * @desc Criar uma nova intenção de participação
 * @route POST /api/intents
 * @access Public
 */
export const createIntent = async (req, res) => {
  try {
    const { name, email, phone, business, message } = req.body;

    // Validação simples
    if (!name || !email || !phone || !business) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes" });
    }

    // Cria e salva no banco
    const intent = await Intent.create({
      name,
      email,
      phone,
      business,
      message,
      status: "pending",
      createdAt: new Date(),
    });

    res.status(201).json(intent);
  } catch (error) {
    console.error("Erro ao criar intent:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

/**
 * @desc Listar todas as intenções
 * @route GET /api/intents
 * @access Admin (por exemplo)
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
 * @desc Buscar uma intenção específica
 * @route GET /api/intents/:id
 * @access Admin
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
 * @desc Excluir uma intenção
 * @route DELETE /api/intents/:id
 * @access Admin
 */
export const deleteIntent = async (req, res) => {
  try {
    const intent = await Intent.findByIdAndDelete(req.params.id);
    if (!intent) {
      return res.status(404).json({ error: "Intent não encontrada" });
    }
    res.json({ message: "Intent removida com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir intent:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

/**
 * @desc Atualizar status de uma intenção
 * @route PATCH /api/intents/:id
 * @access Admin
 */
export const updateIntentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ error: "Status inválido" });
    }

    const intent = await Intent.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!intent) {
      return res.status(404).json({ error: "Intent não encontrada" });
    }

    res.json(intent);
  } catch (error) {
    console.error("Erro ao atualizar intent:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

