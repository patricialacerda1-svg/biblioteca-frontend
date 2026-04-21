import "dotenv/config";
import jwt from "jsonwebtoken";

export function validateToken(req, res, next) {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ mensagem: "Token não fornecido." });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // 🔐 salva usuário na requisição
    req.usuario = decoded;

    next();
  } catch (err) {
    return res.status(403).json({ mensagem: "Token inválido ou expirado." });
  }
}
