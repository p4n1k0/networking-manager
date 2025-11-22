import express from "express";
import { loginAdmin } from "../controllers/adminAuthController.js";
import { adminListPayments, updateStatus } from "../controllers/paymentController.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";
import { listReferrals, updateReferralStatus } from "../controllers/referralController.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/payments", verifyAdmin, adminListPayments);
router.patch("/payments/:id/status", verifyAdmin, updateStatus);
router.get("/referrals", verifyAdmin, listReferrals);

export default router;
