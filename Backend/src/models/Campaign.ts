/**
 * Campaign model for SponsorFlow
 * Represents sponsorship campaigns created by companies
 */
import mongoose, { Schema, Document, model, Types } from "mongoose";
import { SocialPlatform } from "./Company";

/**
 * Allowed budget visibility options
 */
export type BudgetVisibility = "public" | "masked" | "private";

/**
 * Interface representing a Campaign document in MongoDB
 */
export interface Campaign extends Document {
  /** Unique identifier */
  _id: string | Types.ObjectId;
  company: Types.ObjectId;
  title: string;
  description: string;
  budget: number;
  budgetVisibility: BudgetVisibility;
  budgetRange?: string;
  platforms?: SocialPlatform[];
  startDate: Date;
  endDate: Date;
  status: "draft" | "active" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose schema defining the structure of Campaign documents
 */
const campaignSchema = new Schema<Campaign>(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Campaign must belong to a company"],
    },
    title: {
      type: String,
      required: [true, "Campaign title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters long"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Campaign description is required"],
    },
    budget: {
      type: Number,
      required: [true, "Campaign budget is required"],
      min: [0, "Budget cannot be negative"],
    },
    budgetVisibility: {
      type: String,
      enum: ["public", "masked", "private"],
      default: "masked",
      required: true,
    },
    budgetRange: {
      type: String,
      default: null,
    },
    platforms: {
      type: [String],
      enum: ["website", "instagram", "linkedin", "twitter", "youtube", "facebook"],
      default: undefined,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    status: {
      type: String,
      enum: ["draft", "active", "completed"],
      default: "draft",
    },
  },
  { timestamps: true }
);

/**
 * Export the Campaign model
 */
const CampaignModel = mongoose.models.Campaign || model<Campaign>("Campaign", campaignSchema);
export default CampaignModel;
