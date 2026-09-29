const request = require("supertest");
const app = require("../src/app");
const taskService = require("../src/services/taskService");

beforeEach(() => {
  taskService._reset();
});

describe("Task API", () => {

  test("GET /tasks should return all tasks", async () => {
    const response = await request(app)
      .get("/tasks");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("POST /tasks should create a task", async () => {
  const response = await request(app)
    .post("/tasks")
    .send({
      title: "API Test Task",
      description: "Testing POST",
      status: "todo",
      priority: "high",
    });

  expect(response.statusCode).toBe(201);
  expect(response.body.title).toBe("API Test Task");
  expect(response.body.status).toBe("todo");
  expect(response.body.priority).toBe("high");
  expect(response.body.id).toBeDefined();
});

test("POST /tasks should reject missing title", async () => {
  const response = await request(app)
    .post("/tasks")
    .send({
      description: "No title",
    });

  expect(response.statusCode).toBe(400);
  expect(response.body.error).toBeDefined();
});

test("GET /tasks?status=todo should filter tasks", async () => {
  await request(app)
    .post("/tasks")
    .send({
      title: "Todo Task",
      status: "todo",
    });

  await request(app)
    .post("/tasks")
    .send({
      title: "Done Task",
      status: "done",
    });

  const response = await request(app)
    .get("/tasks?status=todo");

  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveLength(1);
  expect(response.body[0].status).toBe("todo");
});

test("GET /tasks?page=1&limit=2 should return paginated tasks", async () => {
  await request(app)
    .post("/tasks")
    .send({ title: "Task 1" });

  await request(app)
    .post("/tasks")
    .send({ title: "Task 2" });

  await request(app)
    .post("/tasks")
    .send({ title: "Task 3" });

  const response = await request(app)
    .get("/tasks?page=1&limit=2");

  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveLength(2);
  expect(response.body[0].title).toBe("Task 1");
  expect(response.body[1].title).toBe("Task 2");
});

test("GET /tasks/stats should return statistics", async () => {
  await request(app)
    .post("/tasks")
    .send({
      title: "Todo Task",
      status: "todo",
    });

  await request(app)
    .post("/tasks")
    .send({
      title: "Done Task",
      status: "done",
    });

  const response = await request(app)
    .get("/tasks/stats");

  expect(response.statusCode).toBe(200);
  expect(response.body.todo).toBe(1);
  expect(response.body.done).toBe(1);
});

test("DELETE /tasks/:id should delete a task", async () => {
  const createResponse = await request(app)
    .post("/tasks")
    .send({
      title: "Delete Me",
    });

  const id = createResponse.body.id;

  const response = await request(app)
    .delete(`/tasks/${id}`);

  expect(response.statusCode).toBe(204);
});

test("DELETE /tasks/:id should return 404 for missing task", async () => {
  const response = await request(app)
    .delete("/tasks/non-existent-id");

  expect(response.statusCode).toBe(404);
});

test("PUT /tasks/:id should update a task", async () => {
  const createResponse = await request(app)
    .post("/tasks")
    .send({
      title: "Old Title",
      priority: "low",
    });

  const id = createResponse.body.id;

  const response = await request(app)
    .put(`/tasks/${id}`)
    .send({
      title: "Updated Title",
      priority: "high",
    });

  expect(response.statusCode).toBe(200);
  expect(response.body.title).toBe("Updated Title");
  expect(response.body.priority).toBe("high");
});

test("PATCH /tasks/:id/complete should complete a task", async () => {
  const createResponse = await request(app)
    .post("/tasks")
    .send({
      title: "Complete Me",
      priority: "high",
    });

  const id = createResponse.body.id;

  const response = await request(app)
    .patch(`/tasks/${id}/complete`);

  expect(response.statusCode).toBe(200);
  expect(response.body.status).toBe("done");
  expect(response.body.priority).toBe("high");
  expect(response.body.completedAt).not.toBeNull();
});

test("PATCH /tasks/:id/assign should assign a task", async () => {
  const createResponse = await request(app)
    .post("/tasks")
    .send({
      title: "Assign Me",
    });

  const id = createResponse.body.id;

  const response = await request(app)
    .patch(`/tasks/${id}/assign`)
    .send({
      assignee: "Kavita",
    });

  expect(response.statusCode).toBe(200);
  expect(response.body.assignee).toBe("Kavita");
});

test("PATCH /tasks/:id/assign should return 404 for missing task", async () => {
  const response = await request(app)
    .patch("/tasks/non-existent-id/assign")
    .send({
      assignee: "Kavita",
    });

  expect(response.statusCode).toBe(404);
});

test("PATCH /tasks/:id/assign should reject empty assignee", async () => {
  const createResponse = await request(app)
    .post("/tasks")
    .send({
      title: "Assign Me",
    });

  const id = createResponse.body.id;

  const response = await request(app)
    .patch(`/tasks/${id}/assign`)
    .send({
      assignee: "",
    });

  expect(response.statusCode).toBe(400);
});

});