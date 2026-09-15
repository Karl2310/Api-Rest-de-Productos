const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL || "http://localhost:3001";

export const requiredAuth = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      error: "Token requerido",
    });
  }

  try {
    const response = await fetch(
      `${AUTH_SERVICE_URL}/validate`,
      {
        method: "GET",
        headers: {
          Authorization: authorization,
        },
      }
    );

    if (!response.ok) {
      return res.status(401).json({
        error: "Token inválido o expirado",
      });
    }

    const data = await response.json();

    req.user = data.user;

    next();
  } catch (error) {
    console.error(
      "Error comunicándose con Auth Service:",
      error.message
    );

    return res.status(503).json({
      error: "Auth Service no disponible",
    });
  }
};