import mongoose from "mongoose";

const intentSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    business: String,
    message: String,
    status: { type: String, default: "pending" },
    token: String,
  },
  { timestamps: true }
);

export default mongoose.model("Intent", intentSchema);
