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
exports.getApplicationsByInfluencer = exports.deleteApplication = exports.updateApplicationStatus = exports.getApplicationDetails = exports.getApplicationsByCampaign = exports.createApplication = void 0;
var Application_1 = require("../../models/Application");
var asyncHandler_1 = require("../../utils/asyncHandler");
var apiresponse_1 = require("../../utils/apiresponse");
var applicationSchema_1 = require("../../../Shared/validations/applicationSchema");
var Campaign_1 = require("../../models/Campaign");
//create new aplication
//  POST /api/campaigns/:campaignId/applications
exports.createApplication = (0, asyncHandler_1.asyncWrapper)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, campaignId, campaign, company, parsedData, existingApplication, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                if (!user || user.usertype !== "influencer") {
                    return [2 /*return*/, apiresponse_1.default.error(res, "Only influencers can apply to campaigns")];
                }
                campaignId = req.params.campaignId;
                if (!campaignId) {
                    return [2 /*return*/, apiresponse_1.default.error(res, "Campaign ID is required")];
                }
                return [4 /*yield*/, Campaign_1.default.findById(campaignId)];
            case 1:
                campaign = _a.sent();
                if (!campaign) {
                    return [2 /*return*/, apiresponse_1.default.error(res, "Campaign not found")];
                }
                company = campaign.company;
                parsedData = applicationSchema_1.applicationSchema.parse(req.body);
                return [4 /*yield*/, Application_1.default.findOne({
                        influencer: user._id,
                        campaign: campaignId,
                    })];
            case 2:
                existingApplication = _a.sent();
                if (existingApplication) {
                    return [2 /*return*/, apiresponse_1.default.error(res, "Application already exists")];
                }
                return [4 /*yield*/, Application_1.default.create({
                        influencer: user._id,
                        campaign: campaignId,
                        company: company.id,
                        status: "pending",
                        message: parsedData.message,
                    })];
            case 3:
                result = _a.sent();
                return [2 /*return*/, apiresponse_1.default.success(res, "Application created successfully", result)];
        }
    });
}); });
//  POST /api/campaigns/:campaignId/applications
exports.getApplicationsByCampaign = (0, asyncHandler_1.asyncWrapper)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, campaignId, applications;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                if (!user || user.usertype !== "company") {
                    return [2 /*return*/, apiresponse_1.default.error(res, "Only companies can view applications")];
                }
                campaignId = req.params.campaignId;
                if (!campaignId) {
                    return [2 /*return*/, apiresponse_1.default.error(res, "Campaign ID is required")];
                }
                return [4 /*yield*/, Application_1.default.find({
                        campaign: campaignId,
                        company: user._id,
                    })];
            case 1:
                applications = _a.sent();
                if (applications.length == 0) {
                    return [2 /*return*/, apiresponse_1.default.error(res, "No applications found for this campaign")];
                }
                return [2 /*return*/, apiresponse_1.default.success(res, "Applications fetched successfully", applications)];
        }
    });
}); });
// GET /api/applications/:applicationId — Get application details (company or influencer)
exports.getApplicationDetails = (0, asyncHandler_1.asyncWrapper)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, applicationId, application, filteredApplication;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                if (user.usertype !== "company" && user.usertype !== "influencer") {
                    return [2 /*return*/, apiresponse_1.default.error(res, "Unauthorized access")];
                }
                applicationId = req.params.applicationId;
                if (!applicationId) {
                    return [2 /*return*/, apiresponse_1.default.error(res, "Application ID is required")];
                }
                return [4 /*yield*/, Application_1.default.findById(applicationId)
                        .populate("influencer", "username displayName email contentType platforms socialMediaProfileLinks experienceYears")
                        .populate("campaign", "title description budget status startDate endDate")
                        .populate("company", "companyName email")];
            case 1:
                application = _a.sent();
                if (!application) {
                    return [2 /*return*/, apiresponse_1.default.error(res, "Application not found")];
                }
                if (user.usertype === "influencer" && application.influencer._id.toString() !== user.id.toString()) {
                    return [2 /*return*/, apiresponse_1.default.error(res, "Unauthorized access")];
                }
                if (user.usertype === "company" && application.company._id.toString() !== user.id.toString()) {
                    return [2 /*return*/, apiresponse_1.default.error(res, "Unauthorized access")];
                }
                filteredApplication = application.toObject();
                if (user.usertype === "company") {
                    delete filteredApplication.company; // don’t expose other companies’ info
                }
                else if (user.usertype === "influencer") {
                    delete filteredApplication.influencer; // don’t expose other influencers’ info
                }
                return [2 /*return*/, apiresponse_1.default.success(res, "Application fetched successfully", filteredApplication)];
        }
    });
}); });
// PATCH /api/applications/:applicationId — Update application status (accept/decline) (company only)
exports.updateApplicationStatus = (0, asyncHandler_1.asyncWrapper)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, applicationId, status, application;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                if (!user || user.usertype !== "company") {
                    return [2 /*return*/, apiresponse_1.default.error(res, "Only companies can update application status")];
                }
                applicationId = req.params.applicationId;
                if (!applicationId) {
                    return [2 /*return*/, apiresponse_1.default.error(res, "Application ID is required")];
                }
                status = req.body.status;
                if (!["pending", "accepted", "rejected"].includes(status)) {
                    return [2 /*return*/, apiresponse_1.default.error(res, "Invalid status value")];
                }
                return [4 /*yield*/, Application_1.default.findOneAndUpdate({ _id: applicationId, company: user._id }, { status: status }, { new: true })];
            case 1:
                application = _a.sent();
                if (!application) {
                    return [2 /*return*/, apiresponse_1.default.error(res, "Application not found or you do not have permission to update it", 404)];
                }
                return [2 /*return*/, apiresponse_1.default.success(res, "Application status updated successfully", application)];
        }
    });
}); });
// DELETE /api/applications/:applicationId — Withdraw/delete application (influencer or admin)
exports.deleteApplication = (0, asyncHandler_1.asyncWrapper)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, applicationId, application;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                applicationId = req.params.applicationId;
                if (!applicationId) {
                    return [2 /*return*/, apiresponse_1.default.error(res, "Application ID is required")];
                }
                return [4 /*yield*/, Application_1.default.findById(applicationId)];
            case 1:
                application = _a.sent();
                if (!application) {
                    return [2 /*return*/, apiresponse_1.default.error(res, "Application not found")];
                }
                if (user.usertype === "influencer" && application.influencer.toString() !== user.id.toString()) {
                    return [2 /*return*/, apiresponse_1.default.error(res, "You can only withdraw your own applications")];
                }
                if (user.usertype === "company" && application.company.toString() !== user.id.toString()) {
                    return [2 /*return*/, apiresponse_1.default.error(res, "You can only delete applications for your own campaigns")];
                }
                return [4 /*yield*/, application.remove()];
            case 2:
                _a.sent();
                return [2 /*return*/, apiresponse_1.default.success(res, "Application deleted successfully")];
        }
    });
}); });
// GET /api/influencers/:influencerId/applications — List influencer’s applications
exports.getApplicationsByInfluencer = (0, asyncHandler_1.asyncWrapper)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, applications;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                if (!user || user.usertype !== "influencer") {
                    return [2 /*return*/, apiresponse_1.default.error(res, "Only influencers can view their applications")];
                }
                return [4 /*yield*/, Application_1.default.find({ influencer: user.id })];
            case 1:
                applications = _a.sent();
                return [2 /*return*/, apiresponse_1.default.success(res, "Applications fetched successfully", applications)];
        }
    });
}); });
