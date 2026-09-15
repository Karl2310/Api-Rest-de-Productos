import Product from "../models/product.js";

export const createProduct = async (productData) => {
  return await Product.create(productData);
};

export const getProducts = async () => {
  return await Product.find();
};

export const getProductById = async (id) => {
  return await Product.findById(id);
};

export const updateProduct = async (id, productData) => {
  return await Product.findByIdAndUpdate(
    id,
    productData,
    {
      new: true,
      runValidators: true,
    }
  );
};

export const deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};


