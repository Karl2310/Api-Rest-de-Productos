import { describe, it, expect, vi } from "vitest";

import * as productRepository from "../products/product.repository.js";
import { createProduct } from "../products/product.service.js";

vi.mock("../products/product.repository.js", () => ({
  createProduct: vi.fn(),
  getProducts: vi.fn(),
  getProductById: vi.fn(),
  updateProduct: vi.fn(),
  deleteProduct: vi.fn(),
}));

describe("Product Service - createProduct", () => {
  it("debe crear un producto válido sin acceder a MongoDB", async () => {
    const product = {
      name: "Laptop",
      price: 1500,
      stock: 10,
    };

    productRepository.createProduct.mockResolvedValue(product);

    const result = await createProduct(product);

    expect(result).toEqual(product);

    expect(
      productRepository.createProduct
    ).toHaveBeenCalledWith(product);
  });
});