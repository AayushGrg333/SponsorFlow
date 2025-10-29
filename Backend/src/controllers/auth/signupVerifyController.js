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
exports.resendVerifyCode = exports.verifySignupCode = void 0;
var User_1 = require("../../models/User");
var Company_1 = require("../../models/Company");
var signupVerifySchema_1 = require("../../../Shared/validations/signupVerifySchema");
var asyncHandler_1 = require("../../utils/asyncHandler");
var apiresponse_1 = require("../../utils/apiresponse");
var randomatic_1 = require("randomatic");
var sendVerificationEmail_1 = require("../../utils/sendVerificationEmail");
exports.verifySignupCode = (0, asyncHandler_1.asyncWrapper)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var parsedData, _a, username, usertype, verificationCode, existingByUsername, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                parsedData = signupVerifySchema_1.verifySchema.safeParse({
                    username: req.params.username,
                    usertype: req.params.usertype,
                    verificationCode: req.body.verificationCode,
                });
                if (!parsedData.success) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            message: "Invalid request data",
                            errors: parsedData.error.errors,
                        })];
                }
                _a = parsedData.data, username = _a.username, usertype = _a.usertype, verificationCode = _a.verificationCode;
                if (!(usertype === "influencer")) return [3 /*break*/, 2];
                return [4 /*yield*/, User_1.default.findOne({ username: username })];
            case 1:
                _b = _c.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, Company_1.default.findOne({ slug: username })];
            case 3:
                _b = _c.sent();
                _c.label = 4;
            case 4:
                existingByUsername = _b;
                if (!existingByUsername) {
                    return [2 /*return*/, apiresponse_1.default.error(res, "User not found", 404)];
                }
                if (!(existingByUsername.verifyCode === verificationCode)) return [3 /*break*/, 8];
                if (!(new Date(existingByUsername.verifyCodeExpiry) < new Date())) return [3 /*break*/, 5];
                return [2 /*return*/, apiresponse_1.default.error(res, "Verification code has expired", 400)];
            case 5:
                existingByUsername.isVerified = true;
                return [4 /*yield*/, existingByUsername.save()];
            case 6:
                _c.sent();
                return [2 /*return*/, apiresponse_1.default.success(res, "User verification successful", 200)];
            case 7: return [3 /*break*/, 9];
            case 8: return [2 /*return*/, apiresponse_1.default.error(res, "Verification code is incorrect", 400)];
            case 9: return [2 /*return*/];
        }
    });
}); });
/**
 * @description Resends a new verification code to the user (company or influencer) via email.
 *
 * @route POST /signup/resend/:usertype/:username
 * @access Public
 *
 * @param {Request} req - Express request object containing usertype and username in params
 * @param {Response} res - Express response object
 *
 * @returns {Promise<Response>} 200 - Code sent, or 400/404 with error message
 */
exports.resendVerifyCode = (0, asyncHandler_1.asyncWrapper)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var parsedData, _a, username, usertype, user, _b, newcode, expiryDate;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                parsedData = signupVerifySchema_1.resendVerifySchema.safeParse({
                    username: req.params.username,
                    usertype: req.params.usertype,
                });
                if (!parsedData.success) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            message: "Invalid request data",
                            errors: parsedData.error.errors,
                        })];
                }
                _a = parsedData.data, username = _a.username, usertype = _a.usertype;
                if (!(usertype === "influencer")) return [3 /*break*/, 2];
                return [4 /*yield*/, User_1.default.findOne({ username: username })];
            case 1:
                _b = _c.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, Company_1.default.findOne({ slug: username })];
            case 3:
                _b = _c.sent();
                _c.label = 4;
            case 4:
                user = _b;
                if (!user) {
                    return [2 /*return*/, apiresponse_1.default.error(res, "User not found", 404)];
                }
                newcode = (0, randomatic_1.default)("0", 6);
                expiryDate = new Date(Date.now() + 15 * 60 * 1000);
                user.verifyCode = newcode;
                user.verifyCodeExpiry = expiryDate;
                return [4 /*yield*/, user.save()];
            case 5:
                _c.sent();
                return [4 /*yield*/, (0, sendVerificationEmail_1.default)(username, user.email, newcode, usertype)];
            case 6:
                _c.sent();
                return [2 /*return*/, apiresponse_1.default.success(res, "Verification code resent", 200)];
        }
    });
}); });
