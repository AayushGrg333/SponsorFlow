
import mongoose, { Schema, Document, model, Types } from "mongoose";

/**
 * Interface representing an Application document in MongoDB
 */
export interface Application extends Document {
  _id: string | Types.ObjectId;
  influencer: Types.ObjectId;
  campaign: Types.ObjectId;
  company: Types.ObjectId;
  status: "pending" | "accepted" | "rejected";
  message?: string;
  appliedAt: Date;
}

/**
 * Mongoose schema defining the structure of Application documents
 */
const applicationSchema = new Schema<Application>(
  {
    influencer: {
      type: Schema.Types.ObjectId,
      ref: "Influencer",
      required: [true, "Application must be associated with an influencer"],
    },
    campaign: {
      type: Schema.Types.ObjectId,
      ref: "Campaign",
      required: [true, "Application must belong to a campaign"],
    },
    company:{
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Application must belong to a company"],
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    message: {
      type: String,
      maxlength: [500, "Message cannot exceed 500 characters"],
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

/**
 * Export the Application model
 */
const ApplicationModel =
  mongoose.models.Application || model<Application>("Application", applicationSchema);

export default ApplicationModel;
