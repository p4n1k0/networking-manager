import express from "express";
import { loginAdmin } from "../controllers/adminAuthController.js";
import {
  adminListMeetings,
  adminUpdateMeeting,
  updateMeetingStatus,
  deleteMeeting,
} from "../controllers/meetingController.js";
import { adminListPayments } from "../controllers/paymentController.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/", verifyAdmin, adminListMeetings);
router.get("/payments", verifyAdmin, adminListPayments);
router.patch("/:id", verifyAdmin, adminUpdateMeeting);
router.patch("/:id/status", verifyAdmin, updateMeetingStatus);
router.delete("/:id", verifyAdmin, deleteMeeting);


export default router;
