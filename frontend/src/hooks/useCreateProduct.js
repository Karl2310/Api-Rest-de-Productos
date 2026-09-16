import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

const API_URL = "http://localhost:3002";
const AUTH_TOKEN_KEY = "products_auth_token";

const createProduct = async (product) => {
  const token = localStorage.getItem(
    AUTH_TOKEN_KEY
  );

  const response = await fetch(
    `${API_URL}/products`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(product),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error || "Error al crear el producto"
    );
  }

  return result;
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
};