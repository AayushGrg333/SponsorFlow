"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocket = void 0;
var Conversation_1 = require("../models/Conversation");
var message_1 = require("../models/message");
var cookie = require("cookie");
var jsonwebtoken_1 = require("jsonwebtoken");
var config_1 = require("../config/config");
var connectedUsers = new Map();
var setupSocket = function (io) {
    io.use(function (socket, next) {
        var cookieHeader = socket.handshake.headers.cookie;
        if (!cookieHeader) {
            return next(new Error("Authentication error"));
        }
        var token = cookie.parse(cookieHeader).token;
        if (!token) {
            return next(new Error("Authentication error"));
        }
        // store token on the socket for later use
        socket.data = socket.data || {};
        socket.data.token = token;
        try {
            var decodeToken = jsonwebtoken_1.default.verify(token, config_1.config.JWT_ACCESS_SECRET);
            socket.data.userId = decodeToken.id;
            socket.data.usertype = decodeToken.usertype;
        }
        catch (err) {
            return next(new Error("Authentication error"));
        }
        next();
    });
    io.on("connection", function (socket) {
        console.log("🟢 New client connected:", socket.id);
        // Register user when they connect
        socket.on("register_user", function (data) { return __awaiter(void 0, void 0, void 0, function () {
            var unreadMessages;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        connectedUsers.set(socket.id, data);
                        console.log("\u2705 ".concat(data.usertype, " ").concat(data.userId, " registered with socket ").concat(socket.id));
                        return [4 /*yield*/, message_1.MessageModel.find({
                                isRead: false,
                                receiver: data.userId,
                            })];
                    case 1:
                        unreadMessages = _a.sent();
                        if (unreadMessages.length > 0) {
                            socket.emit("receive_message", unreadMessages);
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        // Handle sending messages
        socket.on("mark_as_read", function (messageId) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, message_1.MessageModel.findByIdAndUpdate(messageId, {
                            isRead: true,
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        socket.on("send_message", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var conversation, message, _i, _c, _d, socketId, user;
            var senderId = _b.senderId, senderType = _b.senderType, receiverId = _b.receiverId, receiverType = _b.receiverType, content = _b.content;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!content.trim())
                            return [2 /*return*/];
                        return [4 /*yield*/, Conversation_1.ConversationModel.findOne({
                                participants: {
                                    $all: [
                                        { $elemMatch: { id: senderId, model: senderType } },
                                        { $elemMatch: { id: receiverId, model: receiverType } },
                                    ],
                                },
                            })];
                    case 1:
                        conversation = _e.sent();
                        if (!!conversation) return [3 /*break*/, 3];
                        return [4 /*yield*/, Conversation_1.ConversationModel.create({
                                participants: [
                                    { id: senderId, model: senderType },
                                    { id: receiverId, model: receiverType },
                                ],
                            })];
                    case 2:
                        conversation = _e.sent();
                        _e.label = 3;
                    case 3: return [4 /*yield*/, message_1.MessageModel.create({
                            sender: senderId,
                            receiver: receiverId,
                            senderType: senderType,
                            receiverType: receiverType,
                            conversationId: conversation._id,
                            content: content,
                        })];
                    case 4:
                        message = _e.sent();
                        // Send message to both sender and receiver (if online)
                        for (_i = 0, _c = connectedUsers.entries(); _i < _c.length; _i++) {
                            _d = _c[_i], socketId = _d[0], user = _d[1];
                            if (user.userId === senderId || user.userId === receiverId) {
                                io.to(socketId).emit("receive_message", {
                                    conversationId: conversation._id,
                                    senderId: senderId,
                                    receiverId: receiverId,
                                    content: content,
                                    createdAt: message.createdAt,
                                });
                            }
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        // Disconnect
        socket.on("disconnect", function () {
            connectedUsers.delete(socket.id);
            console.log("🔴 Client disconnected:", socket.id);
        });
    });
};
exports.setupSocket = setupSocket;
