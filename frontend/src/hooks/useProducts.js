import { useQuery } from '@tanstack/react-query';

const API_URL = 'http://localhost:3000';
const ENDPOINT = `${API_URL}/products`;

export function useProducts() {
    const token = localStorage.getItem('products_auth_token');

    return useQuery({
        queryKey: ['products', token],
        queryFn: async () => {
            const response = await fetch(ENDPOINT, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Error cargando los productos');
            }

            const data = await response.json();
            return data.products ?? [];
        },
        enabled: Boolean(token),
    });
}