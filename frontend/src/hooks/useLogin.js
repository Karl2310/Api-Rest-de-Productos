import { useMutation } from "@tanstack/react-query";

const API_URL = "http://localhost:3000";

export function useLogin() {
    return useMutation({
        mutationFn: async (credentials) => {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(username, password),
            });
            if (!response.ok) {
                throw new Error('error al iniciar sesion');
            }
            const data = await response.json();
            return data;
        },
    })
}