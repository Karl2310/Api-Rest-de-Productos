# API REST de Productos

1. Entrar a la carpeta `backend`.
2. Ejecutar `npm install`.
3. Crear un archivo `.env` con tu conexión a MongoDB.
4. Levantar el proyecto con `npm start`.



## Tarea 3 — Refactor arquitectónico

Se reorganizó el proyecto para mejorar la separación de responsabilidades y facilitar su mantenimiento.

### Backend

El backend fue organizado por dominio dentro de la carpeta `products`:

- `product.routes.js`: recibe y gestiona las peticiones HTTP.
- `product.service.js`: contiene la lógica de negocio.
- `product.repository.js`: se encarga del acceso a MongoDB.
- `product.schema.js`: contiene las validaciones realizadas con Zod.
- `authMiddleware.js`: valida los tokens JWT.

Esta estructura permite separar las responsabilidades y evitar que las rutas manejen directamente la lógica de negocio o el acceso a la base de datos.

### Frontend

La lógica relacionada con las peticiones se extrajo a hooks personalizados:

- `useLogin.js`: gestiona el inicio de sesión.
- `useProducts.js`: obtiene los productos.
- `useCreateProduct.js`: crea nuevos productos.

De esta forma, `App.jsx` queda principalmente encargado de la interfaz y de la interacción con los componentes.

### Objetivo del refactor

La reorganización busca mejorar la mantenibilidad, reutilización y claridad del código sin agregar nueva funcionalidad al proyecto.