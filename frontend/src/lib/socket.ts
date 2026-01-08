// lib/socket.ts
import { io, Socket } from "socket.io-client"

const SOCKET_URL = "https://sponsorflow-v1.onrender.com/api" // or "http://localhost:8000"

let socket: Socket | null = null

export const initSocket = (userId: string, userType: "influencer" | "company") => {
  if (socket?.connected) {
    return socket
  }

  socket = io(SOCKET_URL, {
    withCredentials: true,
    transports: ["websocket", "polling"],
  })

  socket.on("connect", () => {
    console.log("Socket connected:", socket?.id)
    socket?.emit("register_user", { userId, usertype: userType })
  })

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error)
  })

  socket.on("disconnect", () => {
    console.log("Socket disconnected")
  })

  return socket
}

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket not initialized. Call initSocket first.")
  }
  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const sendMessage = (data: {
  senderId: string
  senderType: "influencer" | "company"
  receiverId: string
  receiverType: "influencer" | "company"
  content: string
}) => {
  const socket = getSocket()
  socket.emit("send_message", data)
}

export const markAsRead = (messageId: string) => {
  const socket = getSocket()
  socket.emit("mark_as_read", messageId)
}

export const onReceiveMessage = (callback: (message: any) => void) => {
  const socket = getSocket()
  socket.on("receive_message", callback)
  
  // Return cleanup function
  return () => {
    socket.off("receive_message", callback)
  }
}