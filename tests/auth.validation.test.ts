import request from "supertest";
import { createApp } from "../src/app/app";

describe("Auth validation", () => {
  const app = createApp();

  it("POST /auth/login should 400 when body is missing", async () => {
    const res = await request(app).post("/auth/login").send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Validation failed");
  });

  it("POST /auth/login should 400 when email is invalid", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "not-an-email", password: "secret" });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Validation failed");
  });

  it("POST /auth/signup should 400 when required fields are missing", async () => {
    const res = await request(app).post("/auth/signup").send({ email: "u@test.com" });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Validation failed");
  });

  it("POST /auth/signup should 400 when password too short", async () => {
    const res = await request(app)
      .post("/auth/signup")
      .send({ name: "User", email: "u@test.com", password: "123" });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Validation failed");
  });
});
