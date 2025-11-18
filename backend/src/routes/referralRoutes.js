import express from "express";
import {
  createReferral,
  listReferrals,
  listReferralsByMember,
  updateReferralStatus,
  updateReferralValue,
  updateReferralFeedback
} from "../controllers/referralController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";
import { verifyMember } from "../middlewares/verifyMember.js";

const router = express.Router();

router.post("/", verifyToken, createReferral);
router.get("/member/:id", verifyToken, listReferralsByMember);
router.get("/", verifyAdmin, listReferrals);
router.patch("/:id/status", verifyAdmin, updateReferralStatus);
router.patch("/:id/value", verifyAdmin, updateReferralValue);
router.patch("/:id/feedback", verifyToken, updateReferralFeedback);

export default router;
