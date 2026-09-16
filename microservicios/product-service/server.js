import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./database.js";
import productRoutes from "./products/product.routes.js";
import logger from "./logger.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3002;

app.get("/", (req, res) => {
  res.json({
    message: "Product Service funcionando",
  });
});

app.use("/products", productRoutes);

if (process.env.NODE_ENV !== "test") {
  connectDB();

  app.listen(PORT, () => {
    logger.info(
      {
        service: "product-service",
        port: PORT,
      },
      "Product Service iniciado"
    );
  });
}

export default app;