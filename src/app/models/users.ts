import { IUser } from "../interfaces/user";

const users: IUser[] = [];
let nextId = 1;

const now = () => new Date().toISOString();

export function listUsers(): IUser[] {
  return users;
}

export function getUserById(id: number): IUser | undefined {
  return users.find((u) => u.id === id);
}

export function createUserModel(input: Omit<IUser, "id">): IUser {
  const user: IUser = {
    id: nextId++,
    name: input.name,
    email: input.email,
    password: input.password,
  };
  users.push(user);
  return user;
}

export function updateUserModel(id: number, changes: Partial<Omit<IUser, "id">>): IUser | null {
  const u = getUserById(id);
  if (!u) return null;

  if (changes.name !== undefined) u.name = changes.name;
  if (changes.email !== undefined) u.email = changes.email;
  if (changes.password !== undefined) u.password = changes.password;

  return u;
}

export function deleteUserModel(id: number): boolean {
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return false;
  users.splice(idx, 1);
  return true;
}
