import express from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "./product.service.js";

import { requiredAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /products
router.get("/", async (req, res) => {
  try {
    const products = await getProducts();

    res.json({
      products,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al obtener los productos",
    });
  }
});

// GET /products/:id
router.get("/:id", async (req, res) => {
  try {
    const product = await getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    res.json(product);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      error: "ID de producto inválido",
    });
  }
});

// POST /products
// Esta ruta requiere JWT
router.post("/", requiredAuth, async (req, res) => {
  try {
    const product = await createProduct(req.body);

    res.status(201).json(product);
  } catch (error) {
    console.error(error);

    if (error.name === "ZodError") {
      return res.status(400).json({
        error: "Datos inválidos",
        details: error.issues,
      });
    }

    res.status(500).json({
      error: "Error al crear el producto",
    });
  }
});

// PUT /products/:id
router.put("/:id", async (req, res) => {
  try {
    const product = await updateProduct(
      req.params.id,
      req.body
    );

    if (!product) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    res.json(product);
  } catch (error) {
    console.error(error);

    if (error.name === "ZodError") {
      return res.status(400).json({
        error: "Datos inválidos",
        details: error.issues,
      });
    }

    res.status(400).json({
      error: "Error al actualizar el producto",
    });
  }
});

// DELETE /products/:id
router.delete("/:id", async (req, res) => {
  try {
    const product = await deleteProduct(req.params.id);

    if (!product) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    res.json({
      message: "Producto eliminado correctamente",
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      error: "Error al eliminar el producto",
    });
  }
});

export default router;