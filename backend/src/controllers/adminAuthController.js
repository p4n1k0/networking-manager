import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Credenciais inválidas" });

    if (admin.role !== "admin") return res.status(403).json({ message: "Acesso negado" });

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(400).json({ message: "Credenciais inválidas" });

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ token });
  } catch (err) {
    console.error("loginAdmin error:", err);
    return res.status(500).json({ message: "Erro interno" });
  }
};
