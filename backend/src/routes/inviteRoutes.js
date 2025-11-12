import express from "express";
import { approveIntent, validateInvite, listInvites } from "../controllers/inviteController.js";

const router = express.Router();

router.post("/:intentId/approve", approveIntent);
router.get("/:token/validate", validateInvite);
router.get("/", listInvites);

export default router;
