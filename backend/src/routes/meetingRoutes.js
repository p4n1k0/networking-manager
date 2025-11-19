import express from "express";
import {
  createMeeting,
  listMeetingsByMember,
  checkinMeeting,
  updateMeetingStatus
} from "../controllers/meetingController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";

const router = express.Router();

router.post("/", verifyToken, createMeeting);
router.get("/member/:id", verifyToken, listMeetingsByMember);
router.patch("/:id/checkin", verifyToken, checkinMeeting);
router.patch("/:id/status", verifyAdmin, updateMeetingStatus);

export default router;
