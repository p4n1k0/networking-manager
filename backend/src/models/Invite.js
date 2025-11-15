import mongoose from "mongoose";


const inviteSchema = new mongoose.Schema(
{
token: { type: String, required: true, unique: true },
intentionId: { type: mongoose.Schema.Types.ObjectId, ref: "Intent" },
email: { type: String, required: true },
status: { type: String, enum: ["valid", "invalid"], default: "valid" },
expiresAt: { type: Date },
},
{ timestamps: true }
);


export default mongoose.model("Invite", inviteSchema);
