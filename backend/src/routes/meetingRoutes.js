import express from "express";
import {
  createMeeting,
  listMeetingsByMember,
  checkinMeeting,
  updateMeetingStatus,
} from "../controllers/meetingController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// MEMBER
router.post("/", verifyToken, createMeeting);
router.get("/member/:id", verifyToken, listMeetingsByMember);
router.patch("/:id/checkin", verifyToken, checkinMeeting);
router.patch("/:id/status", verifyToken, updateMeetingStatus);


export default router;
