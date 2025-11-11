import express from "express";
import { createIntent, listIntents } from "../controllers/intentController.js";

const router = express.Router();

router.post("/", createIntent);
router.get("/", listIntents);

export default router;
