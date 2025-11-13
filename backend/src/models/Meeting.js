import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      enum: ["one_to_one", "group", "event"],
      default: "one_to_one",
    },
    notes: {
      type: String,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
        required: true,
      },
    ],
    location: {
      type: String,
      default: "Online",
    },
    durationMinutes: {
      type: Number,
      default: 60,
    },
    checkinStatus: {
      type: String,
      enum: ["scheduled", "checked_in", "missed"],
      default: "scheduled",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Meeting", meetingSchema);
