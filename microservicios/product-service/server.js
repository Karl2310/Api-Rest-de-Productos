import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./database.js";
import productRoutes from "./products/product.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3002;

// Conectar a MongoDB Atlas
connectDB();

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    message: "Product Service funcionando",
  });
});

// Rutas de productos
app.use("/products", productRoutes);

app.listen(PORT, () => {
  console.log(`Product Service running on port ${PORT}`);
});