import { io, Socket } from "socket.io-client";

let socket: Socket;

export const connectSocket = () => {
  if (!socket) {
    socket = io("http://localhost:8000"); // backend URL
  }
  return socket;
};
