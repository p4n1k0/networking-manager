import express from "express";
import {
  createPayment,
  listPayments,
  listMyPayments,
  markAsPaid,
  updateStatus,
  listOverduePayments,
} from "../controllers/paymentController.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/", verifyToken, createPayment);
router.get("/", verifyAdmin, listPayments);
router.get("/me", verifyToken, listMyPayments);
router.get("/overdue", verifyAdmin, listOverduePayments);
router.patch("/:id/pay", verifyAdmin, markAsPaid);
router.patch("/:id/status", verifyAdmin, updateStatus);

export default router;
