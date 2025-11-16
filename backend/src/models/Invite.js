import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true },
    intentionId: { type: mongoose.Schema.Types.ObjectId, ref: "Intent" },
    email: { type: String, required: true },
    status: { type: String, enum: ["valid", "used"], default: "valid" },
    expiresAt: { type: Date, default: () => new Date(Date.now() + 7*24*60*60*1000) },
  },
  { timestamps: true }
);

export default mongoose.model("Invite", inviteSchema);
