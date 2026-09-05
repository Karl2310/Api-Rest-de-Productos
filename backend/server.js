import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cors from "cors";

import connectDB from "./database.js";
import productRoutes from "./products/product.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const SECRET = process.env.SECRET || "secret_tarea_2";

// Conexión a MongoDB
connectDB();

// ============================
// LOGIN
// ============================

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const DEFAULT_USERNAME = process.env.DEFAULT_USERNAME || "admin";
  const DEFAULT_PASSWORD = process.env.DEFAULT_PASSWORD || "123456";

  if (
    username !== DEFAULT_USERNAME ||
    password !== DEFAULT_PASSWORD
  ) {
    return res.status(401).json({
      error: "Usuario o contraseña incorrectos",
    });
  }

  const token = jwt.sign(
    { username },
    SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    message: "Login exitoso",
    token,
  });
});

// ============================
// PRODUCTOS
// ============================

app.use("/products", productRoutes);

// ============================
// SERVIDOR
// ============================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});