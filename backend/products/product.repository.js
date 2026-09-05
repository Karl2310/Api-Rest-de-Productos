import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    stock: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ProductMongo = mongoose.model("Product", productSchema);

// Crear producto
export const createProduct = async (productData) => {
  return await ProductMongo.create(productData);
};

// Obtener todos los productos
export const getProducts = async () => {
  return await ProductMongo.find();
};

// Obtener producto por ID
export const getProductById = async (id) => {
  return await ProductMongo.findById(id);
};

// Actualizar producto
export const updateProduct = async (id, productData) => {
  return await ProductMongo.findByIdAndUpdate(
    id,
    productData,
    {
      new: true,
      runValidators: true,
    }
  );
};

// Eliminar producto
export const deleteProduct = async (id) => {
  return await ProductMongo.findByIdAndDelete(id);
};