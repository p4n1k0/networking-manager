import express from "express";
import { loginAdmin } from "../controllers/adminAuthController.js";
import { adminListPayments, updateStatus } from "../controllers/paymentController.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";
import { listReferrals } from "../controllers/referralController.js";
import { deleteMember } from "../controllers/memberController.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/payments", verifyAdmin, adminListPayments);
router.patch("/payments/:id/status", verifyAdmin, updateStatus);
router.get("/referrals", verifyAdmin, listReferrals);
router.delete("/members/:id", verifyAdmin, deleteMember);

export default router;
