import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./types";
import { registerConnection, unregisterConnection } from "./presence";

let io:
  | Server<ClientToServerEvents, ServerToClientEvents, any, SocketData>
  | null = null;

export function initRealtime(httpServer: import("http").Server) {
  io = new Server<ClientToServerEvents, ServerToClientEvents, any, SocketData>(
    httpServer,
    {
      cors: {
        origin: "*", // Ajusta a tu frontend si es necesario
      },
    }
  );

  // Middleware de autenticación para el handshake
  io.use((socket, next) => {
    try {
      const authHeader =
        (socket.handshake.headers["authorization"] as string | undefined) ||
        undefined;
      const qToken = (socket.handshake.query?.token as string | undefined) || undefined;
      const authToken =
        ((socket.handshake.auth as any)?.token as string | undefined) || undefined;

      const token = authHeader?.startsWith("Bearer ")
        ? authHeader.slice(7)
        : qToken || authToken;

      if (!token) return next(new Error("UNAUTHORIZED"));

      const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
      socket.data.user = { id: String(payload.id || payload._id || payload.userId), role: payload.role };
      return next();
    } catch (e) {
      return next(new Error("UNAUTHORIZED"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.user!.id;

    // Registrar presencia y unirse a su room personal
    registerConnection(userId, socket.id);
    socket.join(`user:${userId}`);

    // Emitir presencia online (global y room personal)
    io!.emit("presence:user:online", { userId });
    io!.to(`user:${userId}`).emit("presence:user:online", { userId });

    // Eventos cliente → servidor
    socket.on("join:projects", ({ projectIds }) => {
      (projectIds || []).forEach((pid) => socket.join(`project:${pid}`));
    });

    socket.on("typing:task", ({ taskId }) => {
      // Hook opcional: si agregas room por tarea en el futuro
      // socket.to(`task:${taskId}`).emit('typing:task', { userId, taskId });
    });

    socket.on("ping", ({ ts }) => {
      socket.emit("pong", { ts });
    });

    socket.on("disconnect", () => {
      const { remaining } = unregisterConnection(userId, socket.id);
      if (remaining === 0) {
        io!.emit("presence:user:offline", { userId });
      }
    });
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error("Socket.IO no inicializado");
  return io;
}
