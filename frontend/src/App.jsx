import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateProducts } from './hooks/useCreateProducts';
import { useProducts } from './hooks/useProducts';
import './App.css';

const API_URL = 'http://localhost:3000';
const AUTH_TOKEN_KEY = 'products_auth_token';

const productSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  price: z.coerce.number().min(1, 'El precio debe ser mayor a 0'),
  stock: z.coerce.number().min(1, 'El stock debe ser mayor a 0'),
});

const loginSchema = z.object({
  username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres'),
  password: z.string().min(4, 'La contraseña debe tener al menos 4 caracteres'),
});

function LoginForm({ onLogin }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setServerError('');

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al iniciar sesión');
      }

      localStorage.setItem(AUTH_TOKEN_KEY, result.token);
      onLogin(result.token);
    } catch (error) {
      setServerError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, border: '1px solid #ddd', borderRadius: 12 }}>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: 12 }}>
        <input type="text" placeholder="Usuario" {...register('username')} />
        {errors.username && <small>{errors.username.message}</small>}

        <input type="password" placeholder="Contraseña" {...register('password')} />
        {errors.password && <small>{errors.password.message}</small>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>

        {serverError && <p style={{ color: 'crimson' }}>{serverError}</p>}
      </form>

      <p style={{ marginTop: 12, fontSize: 14 }}>
        Usuario demo: <strong>admin</strong> / Contraseña: <strong>123456</strong>
      </p>
    </div>
  );
}

function ProductsList() {
  const { data: products = [], isLoading, isError } = useProducts();

  if (isLoading) return <p>Cargando...</p>;
  if (isError) return <p>Error cargando los productos</p>;
  if (!products.length) return <p>No hay productos</p>;

  return (
    <ul>
      {products.map((product) => (
        <li key={product._id || product.id}>
          {product.name} - ${product.price} - Stock: {product.stock}
        </li>
      ))}
    </ul>
  );
}

function ProductForm() {
  const createProduct = useCreateProducts();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = (data) => {
    createProduct.mutate(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: 10, maxWidth: 400 }}>
      <input type="text" placeholder="Nombre" {...register('name')} />
      {errors.name && <small>{errors.name.message}</small>}

      <input type="number" placeholder="Precio" {...register('price')} />
      {errors.price && <small>{errors.price.message}</small>}

      <input type="number" placeholder="Stock" {...register('stock')} />
      {errors.stock && <small>{errors.stock.message}</small>}

      <button type="submit" disabled={createProduct.isPending}>
        {createProduct.isPending ? 'Guardando...' : 'Crear producto'}
      </button>

      {createProduct.isError && <p style={{ color: 'crimson' }}>{createProduct.error.message}</p>}
    </form>
  );
}

function Dashboard({ onLogout }) {
  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Productos</h1>
        <button onClick={onLogout}>Cerrar sesión</button>
      </div>

      <ProductForm />
      <hr />
      <h2>Lista de Productos</h2>
      <ProductsList />
    </div>
  );
}

function App() {
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_TOKEN_KEY) || '');

  const handleLogout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setToken('');
  };

  if (!token) {
    return <LoginForm onLogin={setToken} />;
  }

  return <Dashboard onLogout={handleLogout} />;
}

export default App;
