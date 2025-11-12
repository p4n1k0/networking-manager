import mongoose from "mongoose";

const referralSchema = new mongoose.Schema(
  {
    fromMemberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    toMemberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    clientName: { type: String, required: true },
    businessType: { type: String },
    description: { type: String },
    status: {
      type: String,
      enum: ["in_progress", "won", "lost"],
      default: "in_progress",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Referral", referralSchema);
