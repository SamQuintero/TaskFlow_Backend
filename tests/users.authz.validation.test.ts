import request from "supertest";
import jwt from "jsonwebtoken";
import { createApp } from "../src/app/app";

function makeToken(role: "user" | "admin" = "user") {
  const secret = process.env.JWT_SECRET || "test_secret_key";
  return jwt.sign({ id: "u1", email: "u@test.com", role }, secret, { expiresIn: "1h" });
}

describe("Users authz and validation", () => {
  const app = createApp();

  it("GET /users should 401 without Authorization header", async () => {
    const res = await request(app).get("/users");
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/Authorization header missing/i);
  });

  it("POST /users should 403 for non-admin", async () => {
    const token = makeToken("user");
    const res = await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "John", email: "john@example.com", password: "secret123" });
    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/insufficient permissions/i);
  });

  it("POST /users should 400 for invalid body even as admin", async () => {
    const token = makeToken("admin");
    const res = await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "", email: "not-an-email", password: "123" });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Validation failed");
  });

  it("PUT /users/:id should 400 when body is empty (admin)", async () => {
    const token = makeToken("admin");
    const res = await request(app)
      .put("/users/123")
      .set("Authorization", `Bearer ${token}`)
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Validation failed");
  });

  it("DELETE /users/:id should 403 for non-admin", async () => {
    const token = makeToken("user");
    const res = await request(app)
      .delete("/users/123")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/insufficient permissions/i);
  });
});
