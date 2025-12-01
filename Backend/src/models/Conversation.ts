import { Schema, model, Document, Types } from "mongoose";

/**
 * @typedef Conversation
 * @property {Array<{id: Types.ObjectId, model: string}>} participants - The two users in the chat.
 * @property {Date} createdAt - When the conversation was started.
 * @property {Date} updatedAt - When the last message was sent.
 */
export interface IConversation extends Document {
  participants: { id: Types.ObjectId; model: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    participants: [
      {
        id: { type: Schema.Types.ObjectId, required: true, refPath: "participants.model" },
        model: { type: String, required: true, enum: ["Influencer", "Company"] },
      },
    ],
  },
  { timestamps: true }
);

export const ConversationModel = model<IConversation>("Conversation", conversationSchema);
