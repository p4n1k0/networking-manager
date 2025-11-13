import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "Member", required: true },
    visibleTo: { type: [String], enum: ["members", "admins"], default: ["members"] },
  },
  { timestamps: true }
);

export const Announcement = mongoose.model("Announcement", announcementSchema);
