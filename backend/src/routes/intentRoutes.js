import express from "express";
import { 
    createIntent,
    listIntents,
    getIntentById,
    deleteIntent
} from "../controllers/intentController.js";

const router = express.Router();

router.post("/", createIntent);
router.get("/", listIntents);
router.get("/:id", getIntentById);
router.delete("/:id", deleteIntent);

export default router;
