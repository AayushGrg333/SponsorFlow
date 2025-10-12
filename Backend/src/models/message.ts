import { Schema, model, Document, Types } from "mongoose";

/**
 * @typedef Message
 * @property {Types.ObjectId} sender - The user (influencer or company) who sent the message.
 * @property {Types.ObjectId} receiver - The user who received the message.
 * @property {Types.ObjectId} conversationId - The ID of the conversation this message belongs to.
 * @property {string} content - The text content of the message.
 * @property {boolean} isRead - Whether the receiver has read the message.
 * @property {Date} createdAt - When the message was sent.
 */
export interface IMessage extends Document {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  conversationId: Types.ObjectId;
  senderModel: "Influencer" | "Company";
  receiverModel: "Influencer" | "Company";
  content: string;
  isRead: boolean;
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "senderModel",
    },
    receiver: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "receiverModel",
    },
    senderModel: {
      type: String,
      required: true,
      enum: ["Influencer", "Company"],
    },
    receiverModel: {
      type: String,
      required: true,
      enum: ["Influencer", "Company"],
    },
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const MessageModel = model<IMessage>("Message", messageSchema);
