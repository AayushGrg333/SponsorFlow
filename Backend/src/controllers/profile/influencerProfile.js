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
exports.listInfluencerCampaignsController = exports.listInfluencersController = exports.updateInfluencerProfileController = exports.getInfluencerProfileController = exports.influencerProfileSetupController = void 0;
var asyncHandler_1 = require("../../utils/asyncHandler");
var apiresponse_1 = require("../../utils/apiresponse");
var profileCompletionSchema_1 = require("../../../Shared/validations/profileCompletionSchema");
var User_1 = require("../../models/User");
var Application_1 = require("../../models/Application");
var Campaign_1 = require("../../models/Campaign");
var redis_1 = require("../../config/redis");
exports.influencerProfileSetupController = (0, asyncHandler_1.asyncWrapper)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, parsedData, influencer, _a, realName, displayName, socialMediaProfileLinks, experienceYears, previousSponsorships, contentType, profileImage, platforms, bio;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                user = req.user;
                if (!user) {
                    return [2 /*return*/, apiresponse_1.default.error(res, "Unauthorized", 401)];
                }
                parsedData = profileCompletionSchema_1.influencerProfileSchema.safeParse(req.body);
                if (!parsedData.success) {
                    res.status(400).json({
                        status: "error",
                        message: "Invalid data",
                        errors: parsedData.error.errors,
                    });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, User_1.default.findById(user._id)];
            case 1:
                influencer = _b.sent();
                if (!influencer) {
                    return [2 /*return*/, apiresponse_1.default.error(res, "Influencer not found", 404)];
                }
                _a = parsedData.data, realName = _a.realName, displayName = _a.displayName, socialMediaProfileLinks = _a.socialMediaProfileLinks, experienceYears = _a.experienceYears, previousSponsorships = _a.previousSponsorships, contentType = _a.contentType, profileImage = _a.profileImage, platforms = _a.platforms, bio = _a.bio;
                influencer.realName = realName;
                influencer.bio = bio;
                influencer.socialMediaProfileLinks = socialMediaProfileLinks;
                influencer.experienceYears = experienceYears;
                influencer.previousSponsorships = previousSponsorships;
                influencer.contentType = contentType;
                influencer.profileImage = profileImage;
                influencer.platforms = platforms;
                influencer.displayName = displayName;
                influencer.isProfileComplete = true;
                return [4 /*yield*/, influencer.save()];
            case 2:
                _b.sent();
                return [2 /*return*/, apiresponse_1.default.success(res, "Influencer profile updated successfully", influencer)];
        }
    });
}); });
exports.getInfluencerProfileController = (0, asyncHandler_1.asyncWrapper)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var influencerId, influencerKey, cachedProfile, influencer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                influencerId = req.params.influencerId;
                influencerKey = "influencer:".concat(influencerId);
                return [4 /*yield*/, redis_1.default.client.get(influencerKey)];
            case 1:
                cachedProfile = _a.sent();
                if (cachedProfile) {
                    return [2 /*return*/, apiresponse_1.default.success(res, "Influencer profile fetched successfully", JSON.parse(cachedProfile))];
                }
                return [4 /*yield*/, User_1.default.findOne({
                        $or: [{ _id: influencerId }, { slug: influencerId }],
                        isVerified: true,
                        isProfileComplete: true,
                    }).select("-password -__v -email -createdAt -updatedAt")];
            case 2:
                influencer = _a.sent();
                if (!influencer) {
                    return [2 /*return*/, apiresponse_1.default.error(res, "Influencer not found", 404)];
                }
                return [4 /*yield*/, redis_1.default.client.set(influencerKey, JSON.stringify(influencer), { EX: 3600 })];
            case 3:
                _a.sent();
                return [2 /*return*/, apiresponse_1.default.success(res, "Influencer profile fetched successfully", influencer)];
        }
    });
}); });
exports.updateInfluencerProfileController = (0, asyncHandler_1.asyncWrapper)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var influencerId, authCompanyId, parsedData, influencer;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                influencerId = req.params.influencerId;
                authCompanyId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString();
                if (!authCompanyId || authCompanyId !== influencerId) {
                    return [2 /*return*/, apiresponse_1.default.error(res, "Unauthorized", 401)];
                }
                parsedData = profileCompletionSchema_1.influencerProfileSchema.safeParse(req.body);
                if (!parsedData.success) {
                    res.status(400).json({
                        status: "error",
                        message: "Invalid data",
                        errors: parsedData.error.errors,
                    });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, User_1.default.findByIdAndUpdate(influencerId, {
                        $set: parsedData.data,
                    }, { new: true, runValidators: true })];
            case 1:
                influencer = _b.sent();
                if (!influencer) {
                    return [2 /*return*/, apiresponse_1.default.error(res, "Influencer not found", 404)];
                }
                return [2 /*return*/, apiresponse_1.default.success(res, "Influencer profile updated successfully", influencer)];
        }
    });
}); });
exports.listInfluencersController = (0, asyncHandler_1.asyncWrapper)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, search, contentType, _b, page, _c, limit, query, skip, companies, total;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = req.query, search = _a.search, contentType = _a.contentType, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 10 : _c;
                query = {
                    isVerified: true,
                    isProfileComplete: true,
                };
                if (search) {
                    query.displayName = { $regex: search, $options: "i" };
                }
                if (contentType) {
                    query.contentType = { $elemMatch: { contentType: contentType } };
                }
                skip = (Number(page) - 1) * Number(limit);
                return [4 /*yield*/, User_1.default.find(query)
                        .select("-password -__v -email -createdAt -updatedAt")
                        .skip(skip)
                        .limit(Number(limit))
                        .sort({ createdAt: -1 })];
            case 1:
                companies = _d.sent();
                return [4 /*yield*/, User_1.default.countDocuments(query)];
            case 2:
                total = _d.sent();
                return [2 /*return*/, res.status(200).json({
                        succsess: true,
                        companies: companies,
                        total: total,
                        currentPage: Number(page),
                        totalPages: Math.ceil(total / Number(limit)),
                    })];
        }
    });
}); });
exports.listInfluencerCampaignsController = (0, asyncHandler_1.asyncWrapper)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var influencerId, applications, formatted;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                influencerId = req.params.influencerId;
                if (!influencerId) {
                    return [2 /*return*/, apiresponse_1.default.error(res, "Influencer ID is required", 400)];
                }
                return [4 /*yield*/, Application_1.default.find({
                        influencer: influencerId,
                    })
                        .populate({
                        path: "campaign",
                        model: Campaign_1.default,
                        select: "title budget budgetVisibility status startDate endDate company", // Select only needed fields
                    })
                        .sort({ createdAt: -1 })];
            case 1:
                applications = _a.sent();
                formatted = applications.map(function (app) { return ({
                    campaign: app.campaign,
                    status: app.status,
                    appliedAt: app.createdAt,
                }); });
                return [2 /*return*/, res.status(200).json({
                        status: "success",
                        count: formatted.length,
                        campaigns: formatted,
                    })];
        }
    });
}); });
