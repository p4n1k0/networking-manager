import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "../src/models/User.js";

dotenv.config();

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const exists = await User.findOne({ email: process.env.ADMIN_EMAIL });

  if (exists) {
    console.log("Admin já existe.");
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

  await User.create({
    name: "Administrador",
    email: process.env.ADMIN_EMAIL,
    password: hashedPassword,
    role: "admin"
  });

  console.log("Admin criado com sucesso!");
  process.exit(0);
}

createAdmin();
