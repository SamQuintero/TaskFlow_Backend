import { getIO } from "./index.js";

/**
 * Helper to emit to optional rooms and/or globally (for demo).
 */
function emitToRooms(event: keyof import("./types.js").ServerToClientEvents, payload: any, rooms?: { userId?: string; projectId?: string }, emitGlobal?: boolean) {
  const io = getIO();
  if (rooms?.projectId) io.to(`project:${rooms.projectId}`).emit(event as any, payload);
  if (rooms?.userId) io.to(`user:${rooms.userId}`).emit(event as any, payload);
  if (emitGlobal) io.emit(event as any, payload);
}

/**
 * TASK events
 */
export const publishTaskCreated = (payload: any, rooms: { userId?: string; projectId?: string } = {}) => {
  emitToRooms("task:created", payload, rooms, true); // global for demo
};

export const publishTaskUpdated = (payload: any, rooms: { userId?: string; projectId?: string } = {}) => {
  emitToRooms("task:updated", payload, rooms, false);
};

export const publishTaskDeleted = (payload: any, rooms: { userId?: string; projectId?: string } = {}) => {
  emitToRooms("task:deleted", payload, rooms, false);
};

/**
 * GOAL events
 */
export const publishGoalCreated = (payload: any, rooms: { userId?: string; projectId?: string } = {}) => {
  emitToRooms("goal:created", payload, rooms, true); // global for demo
};

export const publishGoalUpdated = (payload: any, rooms: { userId?: string; projectId?: string } = {}) => {
  emitToRooms("goal:updated", payload, rooms, false);
};

export const publishGoalDeleted = (payload: any, rooms: { userId?: string; projectId?: string } = {}) => {
  emitToRooms("goal:deleted", payload, rooms, false);
};

/**
 * FILE events
 */
export const publishFileUploaded = (payload: any, rooms: { userId?: string; projectId?: string } = {}) => {
  emitToRooms("file:uploaded", payload, rooms, true); // global for demo
};

export const publishFileDeleted = (payload: any, rooms: { userId?: string; projectId?: string } = {}) => {
  emitToRooms("file:deleted", payload, rooms, false);
};
