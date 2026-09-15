import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cors from "cors";

import connectDB from "./database.js";
import User from "./models/user.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const SECRET = process.env.SECRET || "secret_auth_service";

// Conectar a MongoDB Atlas
connectDB();

const createDefaultUser = async () => {
  try {
    const username =
      process.env.DEFAULT_USERNAME || "admin";

    const password =
      process.env.DEFAULT_PASSWORD || "123456";

    const existingUser = await User.findOne({ username });

    if (!existingUser) {
      await User.create({
        username,
        password,
      });

      console.log("Usuario admin creado");
    } else {
      console.log("Usuario admin ya existe");
    }
  } catch (error) {
    console.error(
      "Error creando usuario:",
      error.message
    );
  }
};

createDefaultUser();

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    message: "Auth Service funcionando",
  });
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      return res.status(401).json({
        error: "Usuario o contraseña incorrectos",
      });
    }

    const token = jwt.sign(
      { username: user.username },
      SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({
      message: "Login exitoso",
      token,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error en el servicio de autenticación",
    });
  }
});

app.get("/validate", (req, res) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      error: "Token requerido",
    });
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "Token inválido",
    });
  }

  try {
    const decoded = jwt.verify(token, SECRET);

    res.json({
      valid: true,
      user: decoded,
    });
  } catch (error) {
    res.status(401).json({
      valid: false,
      error: "Token inválido o expirado",
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});