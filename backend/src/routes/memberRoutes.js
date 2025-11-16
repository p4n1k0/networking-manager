import express from "express";
import { registerMember, listMembers, getMemberById } from "../controllers/memberController.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";

const router = express.Router();

router.post("/", registerMember);
router.get("/", verifyAdmin, listMembers);
router.get("/:id", verifyAdmin, getMemberById);

export default router;
