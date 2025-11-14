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
router.get("/", verifyAdmin,listIntents);
router.get("/:id", verifyAdmin, getIntentById);
router.delete("/:id", verifyAdmin, deleteIntent);
router.patch("/:id", verifyAdmin, updateIntentStatus);

export default router;
