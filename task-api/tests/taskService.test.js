const taskService = require("../src/services/taskService");

describe("Task Service", () => {
  beforeEach(() => {
    taskService._reset();
  });

  test("should return all tasks", () => {
    const tasks = taskService.getAll();

    expect(Array.isArray(tasks)).toBe(true);
  });

  test("should create a new task", () => {
    const task = taskService.create({
      title: "Learn Jest",
      description: "Learn API testing",
      status: "todo",
      priority: "high",
      dueDate: null,
    });

    expect(task.title).toBe("Learn Jest");
    expect(task.description).toBe("Learn API testing");
    expect(task.status).toBe("todo");
    expect(task.priority).toBe("high");
  });

  test("should use default values when optional fields are not provided", () => {
    const task = taskService.create({
      title: "Default Task",
    });

    expect(task.title).toBe("Default Task");
    expect(task.description).toBe("");
    expect(task.status).toBe("todo");
    expect(task.priority).toBe("medium");
    expect(task.dueDate).toBe(null);
  });

  test("should find a task by id", () => {
    const createdTask = taskService.create({
      title: "Find this task",
      description: "Testing findById",
      status: "todo",
      priority: "medium",
    });

    const foundTask = taskService.findById(createdTask.id);

    expect(foundTask).toBeDefined();
    expect(foundTask.id).toBe(createdTask.id);
    expect(foundTask.title).toBe("Find this task");
  });

  test("should return undefined when task does not exist", () => {
    const result = taskService.findById("non-existent-id");

    expect(result).toBeUndefined();
  });

  test("should return tasks by status", () => {
    taskService.create({
      title: "Todo Task",
      status: "todo",
    });

    taskService.create({
      title: "Done Task",
      status: "done",
    });

    taskService.create({
      title: "Another Todo Task",
      status: "todo",
    });

    const tasks = taskService.getByStatus("todo");

    expect(tasks).toHaveLength(2);
    expect(tasks[0].title).toBe("Todo Task");
    expect(tasks[1].title).toBe("Another Todo Task");
  });

  test("should return empty array when no task matches status", () => {
    taskService.create({
      title: "Todo Task",
      status: "todo",
    });

    const tasks = taskService.getByStatus("done");

    expect(tasks).toEqual([]);
  });

   test("should return paginated tasks", () => {
  taskService.create({ title: "Task 1" });
  taskService.create({ title: "Task 2" });
  taskService.create({ title: "Task 3" });
  taskService.create({ title: "Task 4" });

  const tasks = taskService.getPaginated(1, 2);

  expect(tasks).toHaveLength(2);
  expect(tasks[0].title).toBe("Task 1");
  expect(tasks[1].title).toBe("Task 2");
});

 test("should return empty array when page has no tasks", () => {
  taskService.create({ title: "Task 1" });

  const tasks = taskService.getPaginated(5, 10);

  expect(tasks).toEqual([]);
});

 test("should return task statistics", () => {
  taskService.create({
    title: "Todo Task",
    status: "todo",
  });

  taskService.create({
    title: "Progress Task",
    status: "in_progress",
  });

  taskService.create({
    title: "Done Task",
    status: "done",
  });

  const stats = taskService.getStats();

  expect(stats.todo).toBe(1);
  expect(stats.in_progress).toBe(1);
  expect(stats.done).toBe(1);
  expect(stats.overdue).toBe(0);
});

 test("should update a task", () => {
  const task = taskService.create({
    title: "Old Title",
    priority: "low",
  });

  const updatedTask = taskService.update(task.id, {
    title: "New Title",
    priority: "high",
  });

  expect(updatedTask.title).toBe("New Title");
  expect(updatedTask.priority).toBe("high");
  expect(updatedTask.id).toBe(task.id);
});

test("should return null when updating non-existent task", () => {
  const result = taskService.update("invalid-id", {
    title: "New Title",
  });

  expect(result).toBeNull();
});

test("should delete a task", () => {
  const task = taskService.create({
    title: "Delete Me",
  });

  const result = taskService.remove(task.id);

  expect(result).toBe(true);
  expect(taskService.findById(task.id)).toBeUndefined();
});

test("should return false when deleting non-existent task", () => {
  const result = taskService.remove("invalid-id");

  expect(result).toBe(false);
});

test("should mark task as complete without changing priority", () => {
  const task = taskService.create({
    title: "Complete Me",
    priority: "high",
  });

  const completedTask = taskService.completeTask(task.id);

  expect(completedTask.status).toBe("done");
  expect(completedTask.priority).toBe("high");
  expect(completedTask.completedAt).not.toBeNull();
});

test("should only return tasks with exact matching status", () => {
  taskService.create({
    title: "Todo Task",
    status: "todo",
  });

  taskService.create({
    title: "Done Task",
    status: "done",
  });

  const tasks = taskService.getByStatus("do");

  expect(tasks).toEqual([]);
});
 
});
