import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  // Você pode usar banco, mas aqui vai algo simples
  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ message: "Credenciais inválidas" });
  }

  // Gera o token de administrador
  const token = jwt.sign(
    { email, isAdmin: true }, // <- AQUI está o isAdmin
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token });
};
