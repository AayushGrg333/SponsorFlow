import { Schema, model, Document, Types } from "mongoose";

/**
 * @typedef Conversation
 * @property {Array} participants - Array of users in this conversation (influencer/company).
 * @property {Date} createdAt - When the conversation was created.
 * @property {Date} updatedAt - When the conversation was last updated.
 */
export interface IConversation extends Document {
  participants: Array<{
    id: Types.ObjectId;
    model: "influencer" | "company";
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    participants: [
      {
        id: {
          type: Schema.Types.ObjectId,
          required: true,
          refPath: "participants.model",
        },
        model: {
          type: String,
          required: true,
          enum: ["influencer", "company"],
        },
      },
    ],
  },
  { timestamps: true }
);

// Index to quickly find conversations by participants
conversationSchema.index({ "participants.id": 1, "participants.model": 1 });

export const ConversationModel = model<IConversation>("Conversation", conversationSchema);