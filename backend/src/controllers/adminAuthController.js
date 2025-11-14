import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Credenciais inválidas" });
  }

  if (user.role !== "admin") {
    return res.status(403).json({ message: "Acesso negado" });
  }

  const validPass = await bcrypt.compare(password, user.password);

  if (!validPass) {
    return res.status(400).json({ message: "Credenciais inválidas" });
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role, isAdmin: true },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token });
};
