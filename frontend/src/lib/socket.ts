/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line react-hooks/exhaustive-deps
// eslint-disable-next-line @next/next/no-img-element
import { io, Socket } from "socket.io-client"
import { authStorage } from "./authHelper"

const SOCKET_URL = "https://sponsorflow-v1.onrender.com" // or "http://localhost:8000"

let socket: Socket | null = null

export const initSocket = (userId: string, userType: "influencer" | "company") => {
  if (socket?.connected) {
    return socket
  }

  // Get token using the auth helper
  const token = authStorage.getToken()

  if (!token) {
    console.error("No token found. Cannot initialize socket.")
    return null
  }

  socket = io(SOCKET_URL, {
    withCredentials: true,
    transports: ["websocket", "polling"],
    auth: {
      token: token, // Pass token in auth
    },
    query: {
      token: token, // Also pass in query as fallback
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  })

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket?.id)
    socket?.emit("register_user", { userId, usertype: userType })
  })

  socket.on("registered", (data) => {
    console.log("✅ User registered:", data)
  })

  socket.on("auth_error", (error) => {
    console.error("❌ Socket auth error:", error)
  })

  socket.on("connect_error", (error) => {
    console.error("❌ Socket connection error:", error)
    console.log("Attempting to reconnect...")
  })

  socket.on("disconnect", (reason) => {
    console.log("⚠️ Socket disconnected:", reason)
    if (reason === "io server disconnect") {
      // Server disconnected, manually reconnect
      socket?.connect()
    }
  })

  socket.on("reconnect", (attemptNumber) => {
    console.log("✅ Reconnected after", attemptNumber, "attempts")
    // Re-register user after reconnection
    socket?.emit("register_user", { userId, usertype: userType })
  })

  socket.on("message_error", (data) => {
    console.error("❌ Message error:", data)
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

export const onMessageRead = (callback: (data: { messageId: string; conversationId: string }) => void) => {
  const socket = getSocket()
  socket.on("message_read", callback)
  
  return () => {
    socket.off("message_read", callback)
  }
}