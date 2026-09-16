import { test, expect } from "@playwright/test";

test("debe iniciar sesión y crear un producto", async ({ page }) => {
  // Abrir el frontend
  await page.goto("http://localhost:5173");

  // Verificar que aparece el formulario de login
  await expect(
    page.getByRole("heading", {
      name: "Iniciar sesión",
      exact: true,
    })
  ).toBeVisible();

  // Completar usuario
  await page
    .getByPlaceholder("Usuario")
    .fill("admin");

  // Completar contraseña
  await page
    .getByPlaceholder("Contraseña")
    .fill("123456");

  // Iniciar sesión
  await page
    .getByRole("button", {
      name: "Entrar",
      exact: true,
    })
    .click();

  // Verificar que entramos al Dashboard
  await expect(
    page.getByRole("heading", {
      name: "Productos",
      exact: true,
    })
  ).toBeVisible();

  // Completar formulario de producto
  await page
    .getByPlaceholder("Nombre")
    .fill("Producto E2E");

  await page
    .getByPlaceholder("Precio")
    .fill("100");

  await page
    .getByPlaceholder("Stock")
    .fill("10");

  // Crear producto
  await page
    .getByRole("button", {
      name: "Crear producto",
      exact: true,
    })
    .click();

  // Verificar que el producto fue creado
  await expect(
    page.getByText("Producto creado correctamente.", {
      exact: true,
    })
  ).toBeVisible();
});