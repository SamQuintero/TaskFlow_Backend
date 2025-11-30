import request from "supertest";
import jwt from "jsonwebtoken";
import { createApp } from "../src/app/app";

function makeToken(role: "user" | "admin" = "user") {
  const secret = process.env.JWT_SECRET || "test_secret_key";
  return jwt.sign({ id: "u1", email: "u@test.com", role }, secret, { expiresIn: "1h" });
}

describe("Goals validation (protected)", () => {
  const app = createApp();
  const userToken = makeToken("user");

  it("POST /goals should 400 when body is missing required fields", async () => {
    const res = await request(app)
      .post("/goals")
      .set("Authorization", `Bearer ${userToken}`)
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Validation failed");
  });

  it("PUT /goals/:id should 400 when body is empty", async () => {
    const res = await request(app)
      .put("/goals/123")
      .set("Authorization", `Bearer ${userToken}`)
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Validation failed");
  });
});
