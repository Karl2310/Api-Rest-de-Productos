# API REST de Productos

Aplicación full-stack para la gestión de productos, desarrollada con una arquitectura basada en microservicios.

El proyecto incluye autenticación mediante JWT, persistencia con MongoDB Atlas, frontend en React, Docker Compose y diferentes niveles de testing.

---

## Contenido

- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Ejecución](#ejecución)
- [Usuario de prueba](#usuario-de-prueba)
- [Testing](#testing)
- [Comandos principales](#comandos-principales)
- [Evolución del proyecto](#evolución-del-proyecto)

---

## Arquitectura

El proyecto está compuesto por los siguientes servicios:

- **Auth Service**: gestiona el inicio de sesión y la generación de tokens JWT.
- **Product Service**: permite crear, consultar y gestionar productos.
- **Frontend**: interfaz web desarrollada con React.
- **MongoDB Atlas**: base de datos utilizada para almacenar la información.
- **Docker Compose**: orquestación de los servicios del backend.

---

## Tecnologías

### Frontend

- React
- Vite
- TanStack Query
- React Hook Form
- Zod
- Playwright

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- Zod
- JWT
- Pino
- Vitest
- Supertest

### Infraestructura

- Docker
- Docker Compose
- MongoDB Atlas
- Git
- GitHub

---

## Instalación

### 1. Clonar el repositorio

````bash
git clone https://github.com/Karl2310/Api-Rest-de-Productos.git
cd Api-Rest-de-Productos
`````

### 2. Instalar dependencias del Auth Service

cd microservicios/auth-service
npm install

### 3. Instalar dependencias del Product Service

cd ../product-service
npm install

### 4. Instalar dependencias del Frontend

cd ../../frontend
npm install

---

## Ejecución

Opción recomendada: Docker Compose

Desde la raíz:

docker compose up --build

Luego iniciar el frontend en otra terminal:

cd frontend
npm run dev

Abrir:

http://localhost:5173

---

## Usuario de prueba

El proyecto incluye un usuario demo configurado mediante variables de entorno:

Usuario: admin
Contraseña: 123456

---

## Testing

El proyecto incluye diferentes niveles de testing.

Test unitario

Se utiliza Vitest para probar la lógica del servicio sin acceder a MongoDB real.

Ubicación:

microservicios/product-service/tests/product.service.test.js

El repositorio se reemplaza mediante mocks.

Ejecutar:

cd microservicios/product-service
npm test

Test de integración

Se utiliza Supertest para probar un endpoint completo del Product Service.

Ubicación:

microservicios/product-service/tests/product.routes.test.js

Ejecutar:

npm test

Test End-to-End

Se utiliza Playwright para comprobar el flujo principal del frontend.

Ubicación:

frontend/tests/product-flow.spec.js

El test verifica:

Login
  ↓
Dashboard
  ↓
Completar formulario
  ↓
Crear producto
  ↓
Confirmar creación

Para ejecutar:

cd frontend
npx playwright test

Para visualizar el navegador durante la prueba:

npx playwright test --headed

---

## Evolución del proyecto

El proyecto fue desarrollado progresivamente:

Tarea 1

Creación de la API REST de productos con Express, MongoDB/Mongoose y validaciones.

Tarea 2

Incorporación del frontend React y autenticación mediante JWT.

Tarea 3

Refactorización del backend y frontend para mejorar la separación de responsabilidades.

Tarea 4

Diseño de una arquitectura basada en microservicios.

Tarea 5

Implementación real de:

Auth Service.
Product Service.
MongoDB Atlas.
Comunicación REST.
Docker Compose.
Tarea 6

Incorporación de:

Tests unitarios.
Tests de integración.
Tests E2E.
Playwright.
Logging estructurado con Pino.
Tarea 7

Integración final, documentación y preparación de la demostración del sistema.



Comandos principales
Levantar microservicios
docker compose up --build
Detener microservicios
docker compose down
Ejecutar tests del Product Service
cd microservicios/product-service
npm test
Ejecutar tests E2E
cd frontend
npx playwright test
Ejecutar frontend
cd frontend
npm run dev