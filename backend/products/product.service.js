import * as productRepository from "./product.repository.js";
import { productSchema } from "./product.schema.js";

// Crear producto
export const createProduct = async (productData) => {
  const validatedProduct = productSchema.parse(productData);

  return await productRepository.createProduct(validatedProduct);
};

// Obtener todos los productos
export const getProducts = async () => {
  return await productRepository.getProducts();
};

// Obtener producto por ID
export const getProductById = async (id) => {
  return await productRepository.getProductById(id);
};

// Actualizar producto
export const updateProduct = async (id, productData) => {
  const validatedProduct = productSchema.parse(productData);

  return await productRepository.updateProduct(
    id,
    validatedProduct
  );
};

// Eliminar producto
export const deleteProduct = async (id) => {
  return await productRepository.deleteProduct(id);
};