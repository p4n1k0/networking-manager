import express from "express";
import { registerMember, listMembers, getMemberById } from "../controllers/memberController.js";

const router = express.Router();

router.post("/", registerMember);
router.get("/", listMembers);
router.get("/:id", getMemberById);

export default router;
