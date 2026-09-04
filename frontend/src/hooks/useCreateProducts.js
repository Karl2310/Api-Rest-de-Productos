import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = "http://localhost:3000";
const ENDPOINT = `${API_URL}/products`;

export function useCreateProducts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProduct) => {
      const token = localStorage.getItem('products_auth_token');

      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        const message = body.error || body.message || "Error creando el producto";
        throw new Error(message);
      }

      const data = await response.json();
      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
