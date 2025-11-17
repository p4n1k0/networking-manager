import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true },
    intentionId: { type: mongoose.Schema.Types.ObjectId, ref: "Intent" },
    email: { type: String, required: true, lowercase: true },
    status: { type: String, enum: ["valid", "used"], default: "valid" },
    expiresAt: { type: Date, default: () => new Date(Date.now() + 7*24*60*60*1000) },
  },
  { timestamps: true }
);

// TTL to auto remove expired invites (Mongo will remove after expiresAt)
inviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.Invite || mongoose.model("Invite", inviteSchema);
