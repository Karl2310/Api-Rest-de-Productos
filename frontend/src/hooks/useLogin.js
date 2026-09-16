import { useMutation } from "@tanstack/react-query";

const API_URL = "http://localhost:3001";

export function useLogin() {
  return useMutation({
    mutationFn: async (credentials) => {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Error al iniciar sesión"
        );
      }

      return data;
    },
  });
}