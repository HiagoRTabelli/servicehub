const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Token não fornecido",
      });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          error: "Token inválido",
        });
      }

      req.userId = decoded.id;
      req.userRole = decoded.role;

      next();
    });
  } catch (error) {
    return res.status(500).json({
      error: "Erro na autenticação",
    });
  }
}

module.exports = authMiddleware;