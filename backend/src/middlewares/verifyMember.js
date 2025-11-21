import jwt from "jsonwebtoken";

export const verifyMember = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ message: "Token não enviado" });

    const token = auth.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "member") {
            return res.status(403).json({ message: "Acesso negado (somente membros)" });
        }

        req.member = decoded; // contém id, email, role...
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token inválido" });
    }
};
