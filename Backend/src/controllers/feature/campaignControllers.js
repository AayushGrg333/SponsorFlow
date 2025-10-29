"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.getCampaignByCompanyController = exports.deleteCampaignController = exports.updateCampaignController = exports.listCampaignsController = exports.getCampaignController = exports.createCampaignController = void 0;
var Campaign_1 = require("../../models/Campaign");
var asyncHandler_1 = require("../../utils/asyncHandler");
var apiresponse_1 = require("../../utils/apiresponse");
var campaignSchema_1 = require("../../../Shared/validations/campaignSchema");
exports.createCampaignController = (0, asyncHandler_1.asyncWrapper)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, parsedData, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                if (!user) {
                    return [2 /*return*/, apiresponse_1.default.error(res, "Unauthorized", 401)];
                }
                ;
                parsedData = campaignSchema_1.campaignSchema.safeParse(req.body);
                if (!parsedData.success) {
                    return [2 /*return*/, res.status(400).json({
                            status: "error",
                            message: "Invalid data",
                            errors: parsedData.error.errors,
                        })];
                }
                ;
                return [4 /*yield*/, Campaign_1.default.create(__assign(__assign({}, parsedData.data), { company: user._id }))];
            case 1:
                result = _a.sent();
                return [2 /*return*/, apiresponse_1.default.success(res, "Campaign created successfully", result)];
        }
    });
}); });
exports.getCampaignController = (0, asyncHandler_1.asyncWrapper)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user, guestCampaign, campaign;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                user = req.user;
                if (!!user) return [3 /*break*/, 2];
                return [4 /*yield*/, Campaign_1.default.findById(id).select("title description platforms startDate endDate status createdAt")];
            case 1:
                guestCampaign = _a.sent();
                if (!guestCampaign) {
                    return [2 /*return*/, apiresponse_1.default.error(res, "Campaign not found", 404)];
                }
                return [2 /*return*/, apiresponse_1.default.success(res, "Campaign fetched successfully", guestCampaign)];
            case 2: return [4 /*yield*/, Campaign_1.default.findById(id).select("company title description budget budgetRange platforms startDate endDate status createdAt")];
            case 3:
                campaign = _a.sent();
                if (!campaign) {
                    return [2 /*return*/, apiresponse_1.default.error(res, "Campaign not found", 404)];
                }
                return [2 /*return*/, apiresponse_1.default.success(res, "Campaign fetched successfully", campaign)];
        }
    });
}); });
exports.listCampaignsController = (0, asyncHandler_1.asyncWrapper)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, campaigns_1, campaigns;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                if (!!user) return [3 /*break*/, 2];
                return [4 /*yield*/, Campaign_1.default.find().select("title description platforms startDate endDate status createdAt")];
            case 1:
                campaigns_1 = _a.sent();
                return [2 /*return*/, apiresponse_1.default.success(res, "Campaigns fetched successfully", campaigns_1)];
            case 2: return [4 /*yield*/, Campaign_1.default.find({ company: user._id }).select("title description budget budgetRange platforms startDate endDate status createdAt")];
            case 3:
                campaigns = _a.sent();
                if (campaigns.length === 0) {
                    return [2 /*return*/, apiresponse_1.default.error(res, "No campaigns found", 404)];
                }
                return [2 /*return*/, apiresponse_1.default.success(res, "Campaigns fetched successfully", campaigns)];
        }
    });
}); });
exports.updateCampaignController = (0, asyncHandler_1.asyncWrapper)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user, parsedData, campaign;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                user = req.user;
                if (!user) {
                    return [2 /*return*/, apiresponse_1.default.error(res, "Unauthorized", 401)];
                }
                parsedData = campaignSchema_1.campaignSchema.partial().safeParse(req.body);
                if (!parsedData.success) {
                    return [2 /*return*/, res.status(400).json({
                            status: "error",
                            message: "Invalid data",
                            errors: parsedData.error.errors,
                        })];
                }
                return [4 /*yield*/, Campaign_1.default.findOne({ _id: id, company: user._id })];
            case 1:
                campaign = _a.sent();
                if (!campaign) {
                    return [2 /*return*/, apiresponse_1.default.error(res, "Campaign not found or you do not have permission to update it", 404)];
                }
                Object.assign(campaign, parsedData.data);
                return [4 /*yield*/, campaign.save()];
            case 2:
                _a.sent();
                return [2 /*return*/, apiresponse_1.default.success(res, "Campaign updated successfully", campaign)];
        }
    });
}); });
exports.deleteCampaignController = (0, asyncHandler_1.asyncWrapper)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user, campaign;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                user = req.user;
                if (!user) {
                    return [2 /*return*/, apiresponse_1.default.error(res, "Unauthorized", 401)];
                }
                return [4 /*yield*/, Campaign_1.default.findOne({ _id: id, company: user._id })];
            case 1:
                campaign = _a.sent();
                if (!campaign) {
                    return [2 /*return*/, apiresponse_1.default.error(res, "Campaign not found or you do not have permission to delete it", 404)];
                }
                return [4 /*yield*/, campaign.remove()];
            case 2:
                _a.sent();
                return [2 /*return*/, apiresponse_1.default.success(res, "Campaign deleted successfully")];
        }
    });
}); });
exports.getCampaignByCompanyController = (0, asyncHandler_1.asyncWrapper)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var companyId, user, guestCampaigns, campaigns;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                companyId = req.params.companyId;
                user = req.user;
                if (!!user) return [3 /*break*/, 2];
                return [4 /*yield*/, Campaign_1.default.find({ company: companyId }).select("title description platforms startDate endDate status createdAt")];
            case 1:
                guestCampaigns = _a.sent();
                if (guestCampaigns.length === 0) {
                    return [2 /*return*/, apiresponse_1.default.error(res, "No campaigns found for this company", 404)];
                }
                return [2 /*return*/, apiresponse_1.default.success(res, "Company campaigns fetched successfully", guestCampaigns)];
            case 2: return [4 /*yield*/, Campaign_1.default.find({ company: companyId })];
            case 3:
                campaigns = _a.sent();
                if (campaigns.length === 0) {
                    return [2 /*return*/, apiresponse_1.default.error(res, "No campaigns found for this company", 404)];
                }
                return [2 /*return*/, apiresponse_1.default.success(res, "Company campaigns fetched successfully", campaigns)];
        }
    });
}); });
