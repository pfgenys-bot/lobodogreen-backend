// frontend/lib/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function initSocket() {
  if (socket) return socket;
  // ajuste aqui para o host da sua API (local ou onrender)
  const backendUrl = process.env.NEXT_PUBLIC_API_WS_URL || "http://localhost:3000";
  socket = io(backendUrl, {
    path: "/socket.io",
    transports: ["websocket"],
    reconnectionAttempts: 5
  });
  return socket;
}

export function getSocket() {
  return socket;
}