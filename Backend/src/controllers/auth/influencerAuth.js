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
exports.logoutcontroller = exports.loginController = exports.influencerCallbackController = exports.influencerSignupController = void 0;
var passport_1 = require("passport");
var loginSchema_1 = require("../../../Shared/validations/loginSchema");
var jsonwebtoken_1 = require("jsonwebtoken");
var User_1 = require("../../models/User");
var config_1 = require("../../config/config");
var asyncHandler_1 = require("../../utils/asyncHandler");
var signupSchema_1 = require("../../../Shared/validations/signupSchema");
var apiresponse_1 = require("../../utils/apiresponse");
var randomatic_1 = require("randomatic");
var bcrypt_1 = require("bcrypt");
var sendVerificationEmail_1 = require("../../utils/sendVerificationEmail");
var errorHandler_1 = require("../../middlewares/errorHandler");
exports.influencerSignupController = (0, asyncHandler_1.asyncWrapper)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var parsedData, _a, username, email, password, existingUserByUsername, existingUserByEmail, verificationCode, hashedPassword, expiryDate;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                parsedData = signupSchema_1.signupSchema.safeParse(req.body);
                if (!parsedData.success) {
                    res.status(400).json({
                        success: false,
                        message: "Invalid signup data",
                        errors: parsedData.error.errors,
                    });
                    return [2 /*return*/];
                }
                _a = parsedData.data, username = _a.username, email = _a.email, password = _a.password;
                return [4 /*yield*/, User_1.default.findOne({
                        username: username,
                        isVerified: true,
                    })];
            case 1:
                existingUserByUsername = _b.sent();
                if (existingUserByUsername) {
                    return [2 /*return*/, apiresponse_1.default.error(res, "username already exists", 400)];
                }
                return [4 /*yield*/, User_1.default.findOne({ email: email })];
            case 2:
                existingUserByEmail = _b.sent();
                verificationCode = (0, randomatic_1.default)("0", 6);
                return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
            case 3:
                hashedPassword = _b.sent();
                expiryDate = new Date(Date.now() + 600000);
                if (!existingUserByEmail) return [3 /*break*/, 8];
                if (!existingUserByEmail.isVerified) return [3 /*break*/, 4];
                return [2 /*return*/, apiresponse_1.default.error(res, "Email already exists", 400)];
            case 4:
                //condition 1:  If email exists but is NOT verified, update the previous entry
                existingUserByEmail.username = username;
                existingUserByEmail.email = email;
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verificationCode;
                existingUserByEmail.verifyCodeExpiry = expiryDate;
                return [4 /*yield*/, existingUserByEmail.save()];
            case 5:
                _b.sent();
                return [4 /*yield*/, (0, sendVerificationEmail_1.default)(username, email, verificationCode, "influencer")];
            case 6:
                _b.sent();
                return [2 /*return*/, apiresponse_1.default.success(res, "Signup successful. Verification code sent")];
            case 7: return [3 /*break*/, 11];
            case 8: 
            //condition 2 :  Create a new user if email does not exist
            return [4 /*yield*/, User_1.default.create({
                    username: username,
                    email: email,
                    password: hashedPassword,
                    verifyCode: verificationCode,
                    verifyCodeExpiry: expiryDate,
                })];
            case 9:
                //condition 2 :  Create a new user if email does not exist
                _b.sent();
                return [4 /*yield*/, (0, sendVerificationEmail_1.default)(username, email, verificationCode, "influencer")];
            case 10:
                _b.sent();
                return [2 /*return*/, apiresponse_1.default.success(res, "Signup successful. Verification code sent")];
            case 11: return [2 /*return*/];
        }
    });
}); });
exports.influencerCallbackController = (0, asyncHandler_1.asyncWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var influencerData, accessTokenSecret, refreshTokenSecret, accessToken, refreshToken;
    return __generator(this, function (_a) {
        influencerData = req.user;
        if (!influencerData) {
            res.status(401).json({
                success: false,
                message: "unable to signup with google "
            });
        }
        accessTokenSecret = process.env.JWT_ACCESS_SECRET;
        refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
        accessToken = jsonwebtoken_1.default.sign({
            id: influencerData.googleId,
            usertype: influencerData.usertype,
        }, accessTokenSecret, { expiresIn: "15m" });
        refreshToken = jsonwebtoken_1.default.sign({
            id: influencerData._id,
            usertype: influencerData.usertype,
        }, refreshTokenSecret, { expiresIn: "30d" });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 day
        });
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000, // 15 min
        });
        res.status(200).json({
            success: true,
            message: "logged in successfully with google",
        });
        return [2 /*return*/];
    });
}); });
exports.loginController = (0, asyncHandler_1.asyncWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var parsedData, usertype, Strategy;
    return __generator(this, function (_a) {
        parsedData = loginSchema_1.loginSchema.safeParse({
            identifier: req.body.identifier,
            password: req.body.password,
            usertype: req.body.usertype,
        });
        if (!parsedData.success) {
            res.status(400).json({
                success: false,
                message: "invalid login data",
                error: parsedData.error.errors,
            });
            return [2 /*return*/];
        }
        usertype = parsedData.data.usertype;
        Strategy = parsedData.data.usertype === "company" ? "company-local" : "influencer-local";
        passport_1.default.authenticate(Strategy, function (err, user, info) {
            if (err)
                return next(err);
            if (!user) {
                errorHandler_1.log.info("Login failed", {
                    error: info.message || "Invalid credentials",
                });
                return apiresponse_1.default.error(res, "Invalid credentials", 401);
            }
            var accessTokenSecret = config_1.config.JWT_ACCESS_SECRET;
            var refreshTokenSecret = config_1.config.JWT_REFRESH_SECRET;
            var accessToken = jsonwebtoken_1.default.sign({
                id: user._id,
                usertype: usertype
            }, accessTokenSecret, { expiresIn: "15m" });
            var refreshToken = jsonwebtoken_1.default.sign({
                id: user._id,
                usertype: usertype
            }, refreshTokenSecret, { expiresIn: "30d" });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 day
            });
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000 // 15 min
            });
            return res.status(200).json({
                success: true,
                message: "login successful",
                user: user,
            });
        })(req, res, next);
        return [2 /*return*/];
    });
}); });
var logoutcontroller = function (req, res) {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: 'strict'
    });
    res.clearCookie("accessToken", {
        httpOnly: true,
        sameSite: 'strict'
    });
    res.status(200).json({
        success: true,
        message: "logged out successfully"
    });
};
exports.logoutcontroller = logoutcontroller;
