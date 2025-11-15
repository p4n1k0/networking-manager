import jwt from "jsonwebtoken";

export function verifyAdmin(req, res, next) {
  const adminKey = process.env.ADMIN_KEY;
  const headerKey = req.headers["x-admin-key"];

  if (headerKey && headerKey === adminKey) {
    return next();
  }

  // fallback → valida JWT normal
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token não fornecido" });

  const token = authHeader.replace("Bearer ", "");

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token inválido" });
    req.user = user;
    next();
  });
}
