import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin } from "./hooks/useLogin";
import { useProducts } from "./hooks/useProducts";
import { useCreateProduct } from "./hooks/useCreateProduct";

import "./App.css";

const AUTH_TOKEN_KEY = "products_auth_token";

// =========================
// VALIDACIÓN DEL LOGIN
// =========================

const loginSchema = z.object({
  username: z.string().min(3, "El usuario debe tener al menos 3 caracteres"),

  password: z.string().min(4, "La contraseña debe tener al menos 4 caracteres"),
});

// =========================
// VALIDACIÓN DEL PRODUCTO
// =========================

const productSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),

  price: z.coerce.number().positive("El precio debe ser mayor que 0"),

  stock: z.coerce
    .number()
    .int("El stock debe ser un número entero")
    .min(0, "El stock no puede ser negativo"),
});

// =========================
// LOGIN
// =========================

function LoginForm({ onLogin }) {
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [serverError, setServerError] = useState("");

  const onSubmit = (data) => {
    setServerError("");

    login.mutate(data, {
      onSuccess: (result) => {
        localStorage.setItem(AUTH_TOKEN_KEY, result.token);

        onLogin(result.token);
      },

      onError: (error) => {
        setServerError(error.message);
      },
    });
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "40px auto",
        padding: 24,
        border: "1px solid #ddd",
        borderRadius: 12,
      }}
    >
      <h2>Iniciar sesión</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          display: "grid",
          gap: 12,
        }}
      >
        <input
          type="text"
          placeholder="Usuario"
          autoComplete="username"
          {...register("username")}
        />

        {errors.username && <small>{errors.username.message}</small>}

        <input
          type="password"
          placeholder="Contraseña"
          autoComplete="current-password"
          {...register("password")}
        />

        {errors.password && <small>{errors.password.message}</small>}

        <button type="submit" disabled={login.isPending}>
          {login.isPending ? "Entrando..." : "Entrar"}
        </button>

        {serverError && (
          <p
            style={{
              color: "crimson",
            }}
          >
            {serverError}
          </p>
        )}
      </form>

      <p
        style={{
          marginTop: 12,
          fontSize: 14,
        }}
      >
        Usuario demo: <strong>admin</strong>
        {" / "}
        Contraseña: <strong>123456</strong>
      </p>
    </div>
  );
}

// =========================
// LISTA DE PRODUCTOS
// =========================

function ProductsList() {
  const { data, isLoading, isError, error } = useProducts();

  if (isLoading) {
    return <p>Cargando productos...</p>;
  }

  if (isError) {
    return (
      <div>
        <p>Error cargando los productos.</p>

        {error && <small>{error.message}</small>}
      </div>
    );
  }

  const products = data?.products || [];

  if (!products.length) {
    return <p>No hay productos.</p>;
  }

  return (
    <ul>
      {products.map((product) => (
        <li key={product._id || product.id}>
          <strong>{product.name}</strong>
          {" - "}${product.price}
          {" - "}
          Stock: {product.stock}
        </li>
      ))}
    </ul>
  );
}

// =========================
// FORMULARIO DE PRODUCTO
// =========================

function ProductForm() {
  const createProduct = useCreateProduct();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),

    defaultValues: {
      name: "",
      price: "",
      stock: "",
    },
  });

  const onSubmit = (data) => {
    createProduct.mutate(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        display: "grid",
        gap: 10,
        maxWidth: 400,
      }}
    >
      <input type="text" placeholder="Nombre" {...register("name")} />

      {errors.name && <small>{errors.name.message}</small>}

      <input
        type="number"
        placeholder="Precio"
        step="0.01"
        {...register("price")}
      />

      {errors.price && <small>{errors.price.message}</small>}

      <input type="number" placeholder="Stock" {...register("stock")} />

      {errors.stock && <small>{errors.stock.message}</small>}

      <button type="submit" disabled={createProduct.isPending}>
        {createProduct.isPending ? "Guardando..." : "Crear producto"}
      </button>

      {createProduct.isError && (
        <p
          style={{
            color: "crimson",
          }}
        >
          {createProduct.error.message}
        </p>
      )}

      {createProduct.isSuccess && (
        <p
          style={{
            color: "green",
          }}
        >
          Producto creado correctamente.
        </p>
      )}
    </form>
  );
}

// =========================
// DASHBOARD
// =========================

function Dashboard({ onLogout }) {
  return (
    <div
      style={{
        padding: 32,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
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

// =========================
// APP
// =========================

function App() {
  const [token, setToken] = useState(
    () => localStorage.getItem(AUTH_TOKEN_KEY) || "",
  );

  const handleLogout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);

    setToken("");
  };

  if (!token) {
    return <LoginForm onLogin={setToken} />;
  }

  return <Dashboard onLogout={handleLogout} />;
}

export default App;
