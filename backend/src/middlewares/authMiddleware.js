import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Verifica se veio o header
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header não fornecido" });
  }

  // 2. Verifica se está no formato correto
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Formato do token inválido. Use: Bearer <token>" });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id) {
      return res.status(403).json({ message: "Token inválido: payload incompleto" });
    }

    req.user = decoded;
    return next();

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expirado" });
    }

    return res.status(403).json({ message: "Token inválido" });
  }
};
