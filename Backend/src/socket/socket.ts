import { Server } from "socket.io";
import { ConversationModel } from "../models/Conversation";
import { MessageModel } from "../models/message";
import * as cookie from "cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config/config";
import mongoose from "mongoose";

interface UserSocket {
     userId: string;
     usertype: "influencer" | "company";
}

const connectedUsers = new Map<string, UserSocket>();

export const setupSocket = (io: Server) => {
     io.use((socket, next) => {
          const cookieHeader = socket.handshake.headers.cookie;
          const authHeader = socket.handshake.auth?.token;
          const queryToken = socket.handshake.query?.token;
          let token = null;

          if (cookieHeader) {
               const parsed = cookie.parse(cookieHeader);
               token = parsed.token || parsed.accessToken; // Check both cookie names
          }

          // Fallback to auth or query
          if (!token) {
               token = authHeader || queryToken;
          }

          // If still no token, allow connection but user needs to register manually
          if (!token) {
               console.log(
                    "No token found, allowing connection for manual registration"
               );
               return next();
          }

          // store token on the socket for later use
          (socket as any).data = (socket as any).data || {};
          (socket as any).data.token = token;

          try {
               const decodeToken = jwt.verify(
                    token,
                    config.JWT_ACCESS_SECRET
               ) as JwtPayload;
               (socket as any).data.userId = decodeToken.id;
               (socket as any).data.usertype = decodeToken.usertype;
               console.log(`Socket authenticated for user: ${decodeToken.id}`);
          } catch (err) {
               console.error("JWT verification failed:", err);
               // Still allow connection but log the error
               return next();
          }
     });

     io.on("connection", (socket) => {
          console.log("User connected:", socket.id);

          // Register user when they connect
          socket.on("register_user", async (data: UserSocket) => {
               connectedUsers.set(socket.id, data);
               console.log(
                    `User registered: ${data.userId} (${data.usertype})`
               );

               // Send unread messages to the user
               const unreadMessages = await MessageModel.find({
                    isRead: false,
                    receiver: new mongoose.Types.ObjectId(data.userId),
               }).lean();

               if (unreadMessages.length > 0) {
                    // Transform messages to match frontend interface
                    const transformedMessages = unreadMessages.map((msg) => ({
                         _id: msg._id.toString(),
                         senderId: msg.sender.toString(),
                         receiverId: msg.receiver.toString(),
                         senderType: msg.senderType,
                         receiverType: msg.receiverType,
                         content: msg.content,
                         isRead: msg.isRead,
                         createdAt: msg.createdAt,
                         conversationId: msg.conversationId.toString(),
                    }));
                    socket.emit("receive_message", transformedMessages);
               }
          });

          // Handle marking message as read
          socket.on("mark_as_read", async (messageId: string) => {
               try {
                    const message = (await MessageModel.findByIdAndUpdate(
                         messageId,
                         { isRead: true },
                         { new: true }
                    )) as any;

                    if (message) {
                         // Notify sender that message was read
                         for (const [
                              socketId,
                              user,
                         ] of connectedUsers.entries()) {
                              if (user.userId === message.sender.toString()) {
                                   io.to(socketId).emit("message_read", {
                                        messageId: message._id.toString(),
                                        conversationId:
                                             message.conversationId.toString(),
                                   });
                              }
                         }
                    }
               } catch (error) {
                    console.error("Error marking message as read:", error);
               }
          });

          // Handle sending messages
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
                    try {
                         if (!content.trim()) return;

                         // Find or create a conversation
                         let conversation = await ConversationModel.findOne({
                              participants: {
                                   $all: [
                                        {
                                             $elemMatch: {
                                                  id: senderId,
                                                  model: senderType,
                                             },
                                        },
                                        {
                                             $elemMatch: {
                                                  id: receiverId,
                                                  model: receiverType,
                                             },
                                        },
                                   ],
                              },
                         });

                         if (!conversation) {
                              conversation = await ConversationModel.create({
                                   participants: [
                                        {
                                             id: new mongoose.Types.ObjectId(
                                                  senderId
                                             ),
                                             model: senderType,
                                        },
                                        {
                                             id: new mongoose.Types.ObjectId(
                                                  receiverId
                                             ),
                                             model: receiverType,
                                        },
                                   ],
                              });
                         }

                         // Save message with proper ObjectId references
                         const message = (await MessageModel.create({
                              sender: new mongoose.Types.ObjectId(senderId),
                              receiver: new mongoose.Types.ObjectId(receiverId),
                              senderType,
                              receiverType,
                              conversationId: conversation._id,
                              content,
                         })) as any;

                       

                         // Transform message to match frontend interface
                         const transformedMessage = {
                              _id: message._id.toString(),
                              senderId: message.sender.toString(),
                              receiverId: message.receiver.toString(),
                              senderType: message.senderType,
                              receiverType: message.receiverType,
                              conversationId: message.conversationId.toString(),
                              content: message.content,
                              isRead: message.isRead,
                              createdAt: message.createdAt,
                         };

                           console.log("✅ Message created →", {
                              msgId: transformedMessage._id,
                              convId: transformedMessage.conversationId,
                              from: senderId,
                              to: receiverId,
                         });

                         // Send message to both sender and receiver (if online)
                         for (const [
                              socketId,
                              user,
                         ] of connectedUsers.entries()) {
                              if (
                                   user.userId === senderId ||
                                   user.userId === receiverId
                              ) {
                                   io.to(socketId).emit(
                                        "receive_message",
                                        transformedMessage
                                   );
                              }
                         }
                         console.log("📡 Broadcasted receive_message to sockets of:", senderId, "and", receiverId);
                    } catch (error) {
                         console.error("Error sending message:", error);
                         socket.emit("message_error", {
                              error: "Failed to send message",
                         });
                    }
               }
          );

          // Disconnect
          socket.on("disconnect", () => {
               const user = connectedUsers.get(socket.id);
               if (user) {
                    console.log(`User disconnected: ${user.userId}`);
               }
               connectedUsers.delete(socket.id);
          });
     });
};
