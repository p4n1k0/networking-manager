import jwt from "jsonwebtoken";

export function verifyAdmin(req, res, next) {
  const ADMIN_KEY = process.env.ADMIN_KEY;

  // 1) Modo alternativo: x-admin-key
  const headerKey = req.headers["x-admin-key"];
  if (headerKey && ADMIN_KEY && headerKey === ADMIN_KEY) {
    req.user = { role: "admin", method: "admin-key" };
    return next();
  }

  // 2) Modo principal: JWT Bearer token
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token de autenticação não fornecido." });
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme.toLowerCase() !== "bearer" || !token) {
    return res.status(400).json({ error: "Formato inválido de autenticação. Use: Bearer <token>" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // exige admin
    if (!decoded || (!decoded.isAdmin && decoded.role !== "admin")) {
      return res.status(403).json({ error: "Acesso não autorizado. Requer privilégios de administrador." });
    }

    req.user = decoded;
    return next();
  } catch (err) {
    console.error("verifyAdmin() error:", err.message);
    return res.status(403).json({ error: "Token inválido ou expirado." });
  }
}
