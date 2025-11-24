/**
 * Simple presence tracker.
 * Tracks active socket IDs per user to emit offline only when last connection leaves.
 */
const userSockets = new Map<string, Set<string>>();

export function registerConnection(userId: string, socketId: string) {
  if (!userSockets.has(userId)) {
    userSockets.set(userId, new Set());
  }
  userSockets.get(userId)!.add(socketId);
}

export function unregisterConnection(userId: string, socketId: string) {
  const set = userSockets.get(userId);
  if (!set) return { remaining: 0 };
  set.delete(socketId);
  if (set.size === 0) {
    userSockets.delete(userId);
    return { remaining: 0 };
  }
  return { remaining: set.size };
}

export function isUserOnline(userId: string) {
  const set = userSockets.get(userId);
  return !!set && set.size > 0;
}
