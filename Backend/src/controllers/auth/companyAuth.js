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
exports.CompanyCallbackController = exports.companySignupController = void 0;
var signupSchema_1 = require("../../../Shared/validations/signupSchema");
var randomatic_1 = require("randomatic");
var bcrypt_1 = require("bcrypt");
var Company_1 = require("../../models/Company");
var sendVerificationEmail_1 = require("../../utils/sendVerificationEmail");
var asyncHandler_1 = require("../../utils/asyncHandler");
var jsonwebtoken_1 = require("jsonwebtoken");
var config_1 = require("../../config/config");
exports.companySignupController = (0, asyncHandler_1.asyncWrapper)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var parsedData, _a, companyName, email, password, existingUserByUsername, existingUserByEmail, verificationCode, hashedPassword, expiryDate, slug, slug;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                parsedData = signupSchema_1.companySignupSchema.safeParse(req.body);
                if (!parsedData.success) {
                    res.status(400).json({
                        success: false,
                        message: "Invalid signup data",
                        errors: parsedData.error.errors,
                    });
                    return [2 /*return*/];
                }
                _a = parsedData.data, companyName = _a.companyName, email = _a.email, password = _a.password;
                return [4 /*yield*/, Company_1.default.findOne({
                        companyName: companyName,
                        isVerified: true,
                    })];
            case 1:
                existingUserByUsername = _b.sent();
                if (existingUserByUsername) {
                    res.status(400).json({
                        success: false,
                        message: "Company name already exists",
                    });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, Company_1.default.findOne({ email: email })];
            case 2:
                existingUserByEmail = _b.sent();
                verificationCode = (0, randomatic_1.default)("0", 6);
                return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
            case 3:
                hashedPassword = _b.sent();
                expiryDate = new Date(Date.now() + 600000);
                if (!existingUserByEmail) return [3 /*break*/, 8];
                if (!existingUserByEmail.isVerified) return [3 /*break*/, 4];
                res.status(400).json({
                    success: false,
                    message: "Email already exists",
                });
                return [2 /*return*/];
            case 4:
                //condition 1:  If email exists but is NOT verified, update the previous entry
                existingUserByEmail.companyName = companyName;
                existingUserByEmail.email = email;
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verificationCode;
                existingUserByEmail.verifyCodeExpiry = expiryDate;
                if (!existingUserByEmail.slug) {
                    existingUserByEmail.slug = companyName.toLowerCase().replace(/\s+/g, "-");
                }
                slug = companyName.toLowerCase().replace(/\s+/g, "-");
                return [4 /*yield*/, existingUserByEmail.save()];
            case 5:
                _b.sent();
                return [4 /*yield*/, (0, sendVerificationEmail_1.default)(slug, email, verificationCode, "company")];
            case 6:
                _b.sent();
                res.status(200).json({
                    success: true,
                    message: "Signup successful. Verification code sent",
                    verificationCode: verificationCode,
                });
                return [2 /*return*/];
            case 7: return [3 /*break*/, 11];
            case 8:
                slug = companyName.toLowerCase().replace(/\s+/g, "-");
                return [4 /*yield*/, Company_1.default.create({
                        companyName: companyName,
                        email: email,
                        password: hashedPassword,
                        verifyCode: verificationCode,
                        verifyCodeExpiry: expiryDate,
                        slug: slug,
                    })];
            case 9:
                _b.sent();
                return [4 /*yield*/, (0, sendVerificationEmail_1.default)(slug, email, verificationCode, "company")];
            case 10:
                _b.sent();
                res.status(200).json({
                    success: true,
                    message: "Signup successful. Verification code sent",
                });
                return [2 /*return*/];
            case 11: return [2 /*return*/];
        }
    });
}); });
exports.CompanyCallbackController = (0, asyncHandler_1.asyncWrapper)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var companyData, accessTokenSecret, refreshTokenSecret, accessToken, refreshToken;
    return __generator(this, function (_a) {
        companyData = req.user;
        if (!companyData) {
            res.status(401).json({
                success: false,
                message: "Unable to signup with Google",
            });
            return [2 /*return*/];
        }
        accessTokenSecret = config_1.config.JWT_ACCESS_SECRET;
        refreshTokenSecret = config_1.config.JWT_REFRESH_SECRET;
        accessToken = jsonwebtoken_1.default.sign({
            id: companyData._id,
            usertype: companyData.usertype,
        }, accessTokenSecret, { expiresIn: "15m" });
        refreshToken = jsonwebtoken_1.default.sign({
            id: companyData._id,
            usertype: companyData.usertype,
        }, refreshTokenSecret, { expiresIn: "30d" });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000, // 15 minutes
        });
        res.status(200).json({
            success: true,
            message: "Logged in successfully with Google",
        });
        return [2 /*return*/];
    });
}); });
