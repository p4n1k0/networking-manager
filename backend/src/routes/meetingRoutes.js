import express from "express";
import {
  createMeeting,
  listMeetings,
  checkinMeeting,
  updateMeetingStatus,
} from "../controllers/meetingController.js";

const router = express.Router();

router.post("/", createMeeting);
router.get("/", listMeetings);
router.patch("/:id/checkin", checkinMeeting);
router.patch("/:id/status", updateMeetingStatus);

export default router;
