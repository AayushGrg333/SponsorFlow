"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationModel = void 0;
var mongoose_1 = require("mongoose");
var conversationSchema = new mongoose_1.Schema({
    participants: [
        {
            id: { type: mongoose_1.Schema.Types.ObjectId, required: true, refPath: "participants.model" },
            model: { type: String, required: true, enum: ["Influencer", "Company"] },
        },
    ],
}, { timestamps: true });
exports.ConversationModel = (0, mongoose_1.model)("Conversation", conversationSchema);
