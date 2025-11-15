import jwt from "jsonwebtoken";


export function verifyAdmin(req, res, next) {
  // 1) aceita chave administrativa via header (modo manutenção/testes)
  const adminKey = process.env.ADMIN_KEY;
  const headerKey = req.headers["x-admin-key"];

  if (headerKey && headerKey === adminKey) {
    return next();
  }

  // 2) valida Authorization Bearer JWT
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const token = authHeader.replace(/^Bearer\s+/i, "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // exige que o payload indique admin
    if (!decoded || (!decoded.isAdmin && decoded.role !== "admin")) {
      return res.status(403).json({ message: "Acesso não autorizado" });
    }

    req.user = decoded;
    return next();
  } catch (err) {
    console.error("verifyAdmin jwt error:", err.message);
    return res.status(403).json({ message: "Token inválido" });
  }
}
