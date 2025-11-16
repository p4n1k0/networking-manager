import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  business: { type: String },
  password: { type: String, required: true }, // senha hash
  role: { type: String, enum: ["member", "admin"], default: "member" },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  joinedAt: { type: Date, default: Date.now },

  profile: {
    company: { type: String },
    position: { type: String },
    linkedin: { type: String },
  },

  stats: {
    referralsSent: { type: Number, default: 0 },
    referralsReceived: { type: Number, default: 0 },
    thanksGiven: { type: Number, default: 0 },
    thanksReceived: { type: Number, default: 0 },
  },
});

export default mongoose.model("Member", memberSchema);
