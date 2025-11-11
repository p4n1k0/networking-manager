import Intent from "../models/Intent.js";
import { v4 as uuidv4 } from "uuid";

export const createIntent = async (req, res) => {
  try {
    const intent = await Intent.create({
      ...req.body,
      status: "pending",
      token: uuidv4(),
    });
    res.status(201).json(intent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listIntents = async (req, res) => {
  const intents = await Intent.find().sort({ createdAt: -1 });
  res.json(intents);
};
