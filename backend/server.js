import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { z } from "zod";
import jwt from "jsonwebtoken";
import connectDB from "../backend/database.js";

dotenv.config();

const JWT_SECRET = process.env.SECRET || "mi_secreto_local";
const DEFAULT_USERNAME = process.env.DEFAULT_USERNAME || "admin";
const DEFAULT_PASSWORD = process.env.DEFAULT_PASSWORD || "123456";

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// MODELO DE PRODUCTO

const productSchemaMongo = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  stock: {
    type: Number,
    required: true
  }
});

const ProductMongo = mongoose.model("Product", productSchemaMongo);

// VALIDACIÓN CON ZOD

const productSchemaZod = z.object({
  name: z
    .string()
    .min(1, "El nombre es obligatorio"),

  price: z
    .number()
    .positive("El precio debe ser mayor que 0"),

  stock: z
    .number()
    .int("El stock debe ser un número entero")
    .min(0, "El stock no puede ser negativo")
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: "Username y password son obligatorios"
    });
  }

  if (username !== DEFAULT_USERNAME || password !== DEFAULT_PASSWORD) {
    return res.status(401).json({
      error: "Credenciales inválidas"
    });
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });

  return res.json({
    token,
    user: { username }
  });
});

function requiredAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token requerido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
}

// POST /products

app.post("/products", requiredAuth, async (req, res) => {
  const validation = productSchemaZod.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      error: "Datos inválidos",
      details: validation.error.issues
    });
  }

  try {
    const product = new ProductMongo(validation.data);

    const savedProduct = await product.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// GET /products

app.get("/products", requiredAuth, async (req, res) => {
  try {
    const products = await ProductMongo.find();

    res.json({
      products
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// GET /products/:id

app.get("/products/:id", requiredAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const product = await ProductMongo.findById(id);

    if (!product) {
      return res.status(404).json({
        error: "Product not found"
      });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({
      error: "Invalid product ID"
    });
  }
});

// PUT /products/:id

app.put("/products/:id", requiredAuth, async (req, res) => {
  const { id } = req.params;

  const validation = productSchemaZod.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      error: "Datos inválidos",
      details: validation.error.issues
    });
  }

  try {
    const updatedProduct = await ProductMongo.findByIdAndUpdate(
      id,
      validation.data,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        error: "Product not found"
      });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({
      error: "Invalid product ID"
    });
  }
});

// DELETE /products/:id

app.delete("/products/:id", requiredAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await ProductMongo.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        error: "Product not found"
      });
    }

    res.json(deletedProduct);
  } catch (error) {
    res.status(400).json({
      error: "Invalid product ID"
    });
  }
});

// SERVIDOR

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

