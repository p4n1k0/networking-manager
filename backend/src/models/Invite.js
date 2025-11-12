import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  intentionId: { type: mongoose.Schema.Types.ObjectId, ref: "Intent", required: true },
  email: { type: String, required: true },
  status: { type: String, enum: ["valid", "used", "expired"], default: "valid" },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Invite", inviteSchema);
