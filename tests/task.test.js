const request = require("supertest");
const app = require("../app");
const server = require("../server");
const mongoose = require("mongoose");

let token;
let taskId;

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

describe("Task CRUD", () => {
  it("should create a new task", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "New Task",
        description: "This is a new task",
        completed: true,
      });

    expect(response.status).toBe(201);
    taskId = response.body._id;
    expect(response.body.title).toBe("New Task");
  });

  it("should get all tasks", async () => {
    const response = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should update a task", async () => {
    const response = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Task",
        description: "This task has been updated",
        completed: true,
      });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe("Updated Task");
  });

  it("should delete a task", async () => {
    const response = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Task deleted");
  });
});
