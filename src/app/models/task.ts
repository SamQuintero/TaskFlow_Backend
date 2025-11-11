import { ITask, ITaskCreate, ITaskUpdate } from "../interfaces/task";

const tasks: ITask[] = [];
let nextId = 1;

const now = () => new Date().toISOString();

export function listTasks(): ITask[] {
  return tasks;
}

export function getTaskById(id: number): ITask | undefined {
  return tasks.find((t) => t.id === id);
}

export function createTaskModel(input: ITaskCreate): ITask {
  const task: ITask = {
    id: nextId++,
    title: input.title,
    priority: input.priority,
    estimateHours: input.estimateHours,
    dueDate: input.dueDate,
    completed: input.completed ?? false,
    createdAt: now(),
    updatedAt: now(),
  };
  tasks.push(task);
  return task;
}

export function updateTaskModel(id: number, changes: ITaskUpdate): ITask | null {
  const t = getTaskById(id);
  if (!t) return null;

  if (changes.title !== undefined) t.title = changes.title;
  if (changes.priority !== undefined) t.priority = changes.priority;
  if (changes.estimateHours !== undefined) t.estimateHours = changes.estimateHours;
  if (changes.dueDate !== undefined) t.dueDate = changes.dueDate;
  if (changes.completed !== undefined) t.completed = changes.completed;

  t.updatedAt = now();
  return t;
}

export function deleteTaskModel(id: number): boolean {
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return false;
  tasks.splice(idx, 1);
  return true;
}
