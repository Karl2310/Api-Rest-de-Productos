import { useQuery } from "@tanstack/react-query";

const API_URL = "http://localhost:3000";
const AUTH_TOKEN_KEY = "products_auth_token";

const getProducts = async () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  const response = await fetch(`${API_URL}/products`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error || "Error al obtener productos"
    );
  }

  return result;
};

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
};