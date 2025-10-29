"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModel = void 0;
var mongoose_1 = require("mongoose");
var messageSchema = new mongoose_1.Schema({
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        refPath: "senderModel",
    },
    receiver: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        refPath: "receiverType",
    },
    senderType: {
        type: String,
        required: true,
        enum: ["influencer", "company"],
    },
    receiverType: {
        type: String,
        required: true,
        enum: ["influencer", "company"],
    },
    conversationId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, { timestamps: { createdAt: true, updatedAt: false } });
exports.MessageModel = (0, mongoose_1.model)("Message", messageSchema);
