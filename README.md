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

## Tarea 5 — Implementación de microservicios

En esta etapa el backend fue dividido en dos microservicios independientes:

- `auth-service`: encargado de la autenticación y generación de tokens JWT.
- `product-service`: encargado de la gestión de productos.

Cada servicio funciona de manera independiente y utiliza un puerto diferente.

### Arquitectura

```text
                    ┌─────────────────────┐
                    │       Cliente       │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
        ┌─────────────────┐         ┌─────────────────┐
        │   Auth Service  │         │ Product Service │
        │    Puerto 3001  │◄────────│    Puerto 3002  │
        └────────┬────────┘   REST  └────────┬────────┘
                 │                           │
                 ▼                           ▼
        ┌─────────────────┐         ┌─────────────────┐
        │ MongoDB Atlas   │         │ MongoDB Atlas   │
        │    auth_db      │         │   products_db   │
        └─────────────────┘         └─────────────────┘

Bases de datos

Cada microservicio utiliza una base de datos independiente en MongoDB Atlas:

Auth Service → auth_db
Product Service → products_db

No se comparten colecciones entre los servicios.

Docker

Cada microservicio cuenta con su propio Dockerfile.

El archivo docker-compose.yml se encuentra en la raíz del proyecto y permite levantar los servicios utilizando un solo comando:

docker compose up --build

Los servicios quedan disponibles en:

Auth Service: http://localhost:3001
Product Service: http://localhost:3002

Las bases de datos utilizan MongoDB Atlas como servicio externo. Docker se utiliza para ejecutar y coordinar los microservicios.


Ejecución

Para levantar los microservicios mediante Docker:

docker compose up --build

Para detenerlos:

docker compose down