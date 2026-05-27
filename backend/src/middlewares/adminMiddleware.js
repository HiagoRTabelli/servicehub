function adminMiddleware(req, res, next) {
  console.log(req.userRole);

  if (req.userRole !== "ADMIN") {
    return res.status(403).json({
      error: "Acesso negado",
    });
  }

  next();
}

module.exports = adminMiddleware;