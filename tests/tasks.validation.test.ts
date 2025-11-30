import request from "supertest";
import jwt from "jsonwebtoken";
import { createApp } from "../src/app/app";

function makeToken(role: "user" | "admin" = "user") {
  const secret = process.env.JWT_SECRET || "test_secret_key";
  return jwt.sign({ id: "u1", email: "u@test.com", role }, secret, { expiresIn: "1h" });
}

describe("Tasks validation (protected)", () => {
  const app = createApp();
  const userToken = makeToken("user");

  it("POST /tasks should 400 when body is missing required fields", async () => {
    const res = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${userToken}`)
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Validation failed");
  });

  it("POST /tasks should 400 when estimateHours has wrong type", async () => {
    const res = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ title: "Task A", estimateHours: "not-a-number" as any });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Validation failed");
  });

  it("PUT /tasks/:id should 400 when body is empty", async () => {
    const res = await request(app)
      .put("/tasks/123")
      .set("Authorization", `Bearer ${userToken}`)
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Validation failed");
  });
});
