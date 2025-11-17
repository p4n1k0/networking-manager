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

    clientName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },

    businessType: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    status: {
      type: String,
      enum: ["in_progress", "won", "lost"],
      default: "in_progress",
    },

    // ⭐ Admin pode marcar valor estimado gerado pelo negócio
    estimatedValue: {
      type: Number,
      default: 0,
    },

    // ⭐ feedback do membro sobre o resultado
    feedback: {
      type: String,
      trim: true
    },
  },

  { timestamps: true }
);

export default mongoose.model("Referral", referralSchema);
