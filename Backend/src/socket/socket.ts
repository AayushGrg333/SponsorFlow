import { Server } from "socket.io";
import { ConversationModel } from "../models/Conversation";
import { MessageModel } from "../models/message";
import * as cookie from "cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config/config";
interface UserSocket {
  userId: string;
  usertype: "influencer" | "company";
}

const connectedUsers = new Map<string, UserSocket>();

export const setupSocket =  (io: Server) => {

  io.use((socket, next) => {
    const cookieHeader = socket.handshake.headers.cookie;
    if (!cookieHeader) {
      return next(new Error("Authentication error"));
    }

    const { token } = cookie.parse(cookieHeader);
    if (!token) {
      return next(new Error("Authentication error"));
    }

    // store token on the socket for later use
    (socket as any).data = (socket as any).data || {};
    (socket as any).data.token = token;

    try {
      const decodeToken = jwt.verify(token, config.JWT_ACCESS_SECRET) as JwtPayload;
      (socket as any).data.userId = decodeToken.id;
      (socket as any).data.usertype = decodeToken.usertype;
    } catch (err) {
      return next(new Error("Authentication error"));
    }
    next();
  });



  io.on("connection",  (socket) => {
    console.log("🟢 New client connected:", socket.id);

    // Register user when they connect
    socket.on("register_user", async (data: UserSocket) => {
      connectedUsers.set(socket.id, data);
      console.log(`✅ ${data.usertype} ${data.userId} registered with socket ${socket.id}`);
      const unreadMessages = await MessageModel.find({
        isRead : false,
        receiver: data.userId,
      });
          if (unreadMessages.length > 0) {
      socket.emit("receive_message", unreadMessages);
    }
    });

    // Handle sending messages
    socket.on(
      "mark_as_read",
      async (messageId: string) => {
        await MessageModel.findByIdAndUpdate(messageId, {
          isRead : true,
        })
      }
    )

    socket.on(
      "send_message",
      async ({
        senderId,
        senderType,
        receiverId,
        receiverType,
        content,
      }: {
        senderId: string;
        senderType: "influencer" | "company";
        receiverId: string;
        receiverType: "influencer" | "company";
        content: string;
      }) => {
        if (!content.trim()) return;

        // Find or create a conversation
        let conversation = await ConversationModel.findOne({
          participants: {
            $all: [
              { $elemMatch: { id: senderId, model: senderType } },
              { $elemMatch: { id: receiverId, model: receiverType } },
            ],
          },
        });

        if (!conversation) {
          conversation = await ConversationModel.create({
            participants: [
              { id: senderId, model: senderType },
              { id: receiverId, model: receiverType },
            ],
          });
        }

        // Save message
        const message = await MessageModel.create({
          sender: senderId,
          receiver: receiverId,
          senderType,
          receiverType,
          conversationId: conversation._id,
          content,
        });

        // Send message to both sender and receiver (if online)
        for (const [socketId, user] of connectedUsers.entries()) {
          if (user.userId === senderId || user.userId === receiverId) {
            io.to(socketId).emit("receive_message", {
              conversationId: conversation._id,
              senderId,
              receiverId,
              content,
              createdAt: message.createdAt,
            });
          }
        }
      }
    );

    // Disconnect
    socket.on("disconnect", () => {
      connectedUsers.delete(socket.id);
      console.log("🔴 Client disconnected:", socket.id);
    });
  });
};
