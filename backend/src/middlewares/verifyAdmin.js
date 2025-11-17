import jwt from "jsonwebtoken";

export function verifyAdmin(req, res, next) {
  const ADMIN_KEY = process.env.ADMIN_KEY;
  const headerKey = req.headers["x-admin-key"];
  if (headerKey && ADMIN_KEY && headerKey === ADMIN_KEY) {
    req.user = { role: "admin", method: "admin-key" };
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Token não fornecido" });

  const [scheme, token] = authHeader.split(" ");
  if (!token || scheme.toLowerCase() !== "bearer") return res.status(400).json({ error: "Formato inválido" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || (!decoded.isAdmin && decoded.role !== "admin")) {
      return res.status(403).json({ error: "Acesso não autorizado" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    console.error("verifyAdmin error:", err.message);
    return res.status(403).json({ error: "Token inválido" });
  }
}
