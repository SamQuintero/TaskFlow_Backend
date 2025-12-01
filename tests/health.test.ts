import request from "supertest";
import { createApp } from "../src/app/app";

describe("Health endpoint", () => {
  const app = createApp();

  it("GET / should return 'api works'", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toBe("api works");
  });
});
