"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
/**
 * Mongoose schema defining the structure of Application documents
 */
var applicationSchema = new mongoose_1.Schema({
    influencer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Influencer",
        required: [true, "Application must be associated with an influencer"],
    },
    campaign: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Campaign",
        required: [true, "Application must belong to a campaign"],
    },
    company: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, { timestamps: true });
/**
 * Export the Application model
 */
var ApplicationModel = mongoose_1.default.models.Application || (0, mongoose_1.model)("Application", applicationSchema);
exports.default = ApplicationModel;
