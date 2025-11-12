import express from "express";
import { registerMember, listMembers, getMemberById } from "../controllers/memberController.js";

const router = express.Router();

// Criar novo membro (a partir de convite válido)
router.post("/", registerMember);

// Listar todos os membros
router.get("/", listMembers);

// Buscar membro por ID
router.get("/:id", getMemberById);

export default router;
