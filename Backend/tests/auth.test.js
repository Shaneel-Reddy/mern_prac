const request = require("supertest");
const app = require("../app");
const server = require("../server");
const mongoose = require("mongoose");

let token;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await request(app).post("/api/auth/register").send({
    username: "testuser",
    email: "testuser@example.com",
    password: "password123",
  });

  const response = await request(app).post("/api/auth/login").send({
    email: "testuser@example.com",
    password: "password123",
  });

  token = response.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});

describe("Auth", () => {
  it("should register a user", async () => {
    const response = await request(app).post("/api/auth/register").send({
      username: "newuser",
      email: "newuser@example.com",
      password: "password123",
    });

    expect(response.status).toBe(201);
    expect(response.body.token).toBeDefined();
  });

  it("should login the user", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "testuser@example.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });
});
