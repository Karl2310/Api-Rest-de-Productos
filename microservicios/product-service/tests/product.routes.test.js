import { describe, it, expect } from "vitest";
import request from "supertest";

import app from "../server.js";

describe("Product Service - integración", () => {
  it("GET / debe devolver que el servicio está funcionando", async () => {
    const response = await request(app)
      .get("/")
      .expect(200);

    expect(response.body).toEqual({
      message: "Product Service funcionando",
    });
  });
});