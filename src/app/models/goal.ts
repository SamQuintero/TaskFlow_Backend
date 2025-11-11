import { IGoal, IGoalCreate, IGoalUpdate } from "../interfaces/goal";

const goals: IGoal[] = [];
let nextId = 1;

const now = () => new Date().toISOString();

export function listGoals(): IGoal[] {
  return goals;
}

export function getGoalById(id: number): IGoal | undefined {
  return goals.find((g) => g.id === id);
}

export function createGoalModel(input: IGoalCreate): IGoal {
  const goal: IGoal = {
    id: nextId++,
    title: input.title,
    description: input.description,
    dueDate: input.dueDate,
    completed: input.completed ?? false,
    createdAt: now(),
    updatedAt: now(),
  };
  goals.push(goal);
  return goal;
}

export function updateGoalModel(id: number, changes: IGoalUpdate): IGoal | null {
  const g = getGoalById(id);
  if (!g) return null;

  if (changes.title !== undefined) g.title = changes.title;
  if (changes.description !== undefined) g.description = changes.description;
  if (changes.dueDate !== undefined) g.dueDate = changes.dueDate;
  if (changes.completed !== undefined) g.completed = changes.completed;

  g.updatedAt = now();
  return g;
}

export function deleteGoalModel(id: number): boolean {
  const idx = goals.findIndex((g) => g.id === id);
  if (idx === -1) return false;
  goals.splice(idx, 1);
  return true;
}
