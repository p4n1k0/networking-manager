import express from "express";
import { createAnnouncement, listAnnouncements } from "../controllers/announcementController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createAnnouncement);
router.get("/", listAnnouncements);

export default router;
