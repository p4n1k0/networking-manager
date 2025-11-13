import express from "express";
import { 
    createIntent,
    listIntents,
    getIntentById,
    deleteIntent,
    updateIntentStatus,
} from "../controllers/intentController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";

const router = express.Router();

router.post("/", createIntent);
router.get("/", listIntents);
router.get("/:id", verifyToken, verifyAdmin, getIntentById);
router.delete("/:id", verifyToken, verifyAdmin, deleteIntent);
router.patch("/:id", verifyToken, verifyAdmin, updateIntentStatus);

export default router;
