import express from "express";
import {
  createPayment,
  listPayments,
  markAsPaid,
  updateStatus,
  listOverduePayments,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/", createPayment);
router.get("/", listPayments);
router.get("/overdue", listOverduePayments);
router.patch("/:id/pay", markAsPaid);
router.patch("/:id/status", updateStatus);

export default router;
