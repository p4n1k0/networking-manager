import express from "express";
import {
    registerMember,
    listMembers,
    getMemberById,
    memberLogin,
} from "../controllers/memberController.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";
import { verifyMember } from "../middlewares/veifyMember.js";

const router = express.Router();

router.post("/", registerMember);
router.post("/login", memberLogin);
router.get("/", verifyAdmin, listMembers);
router.get("/:id", verifyAdmin, getMemberById);

export default router;
