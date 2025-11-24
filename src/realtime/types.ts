export type ServerToClientEvents = {
  'task:created': (data: any) => void;
  'task:updated': (data: any) => void;
  'task:deleted': (data: any) => void;

  'goal:created': (data: any) => void;
  'goal:updated': (data: any) => void;
  'goal:deleted': (data: any) => void;

  'file:uploaded': (data: any) => void;
  'file:deleted': (data: any) => void;

  'presence:user:online': (data: { userId: string }) => void;
  'presence:user:offline': (data: { userId: string }) => void;

  'pong': (data: { ts: number }) => void;
};

export type ClientToServerEvents = {
  'join:projects': (data: { projectIds: string[] }) => void;
  'typing:task': (data: { taskId: string }) => void;
  'ping': (data: { ts: number }) => void;
};

// Optional: describe the socket.data shape used by our server
export type SocketData = {
  user?: { id: string; role?: string };
};
