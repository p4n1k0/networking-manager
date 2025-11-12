import express from "express";
import {
  createReferral,
  listReferrals,
  updateReferralStatus,
} from "../controllers/referralController.js";

const router = express.Router();

router.post("/", createReferral);
router.get("/", listReferrals);
router.patch("/:id/status", updateReferralStatus);

export default router;
