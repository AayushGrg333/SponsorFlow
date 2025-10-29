"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Campaign model for SponsorFlow
 * Represents sponsorship campaigns created by companies
 */
var mongoose_1 = require("mongoose");
/**
 * Mongoose schema defining the structure of Campaign documents
 */
var campaignSchema = new mongoose_1.Schema({
    company: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, { timestamps: true });
/**
 * Export the Campaign model
 */
var CampaignModel = mongoose_1.default.models.Campaign || (0, mongoose_1.model)("Campaign", campaignSchema);
exports.default = CampaignModel;
