import express from "express";
import mongoose from "mongoose";
import os from "os";

const router = express.Router();

router.get("/", async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  const uptime = process.uptime();

  res.json({
    status: "ok",
    db: dbStatus,
    uptime: `${Math.round(uptime)}s`,
    version: "1.0.0",
    server: os.hostname(),
  });
});

export default router;
