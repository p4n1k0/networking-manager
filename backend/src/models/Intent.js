import mongoose from "mongoose";

const intentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  business: { type: String, required: true },
  message: { type: String },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  token: { type: String }
});

export default mongoose.model("Intent", intentSchema);
