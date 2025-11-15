import express from "express";
import { validateInviteToken } from "../controllers/inviteController.js";


const router = express.Router();


router.get("/:token/validate", validateInviteToken);


export default router;
