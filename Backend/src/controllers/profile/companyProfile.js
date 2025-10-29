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
exports.updateCompanyProfileController = exports.listCompaniesController = exports.getCompanyProfileController = exports.companyProfileSetupController = void 0;
var profileCompletionSchema_1 = require("@/Shared/validations/profileCompletionSchema");
var Company_1 = require("../../models/Company");
var asyncHandler_1 = require("../../utils/asyncHandler");
var apiresponse_1 = require("../../utils/apiresponse");
var redis_1 = require("../../config/redis");
exports.companyProfileSetupController = (0, asyncHandler_1.asyncWrapper)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, parsedData, company, _a, email, addressType, address, contactNumber, contentType, profileImage, products, establishedYear, description, socialLinks;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                user = req.user;
                if (!user) {
                    return [2 /*return*/, apiresponse_1.default.error(res, "Unauthorized", 401)];
                }
                parsedData = profileCompletionSchema_1.companyProfileSchema.safeParse(req.body);
                if (!parsedData.success) {
                    res.status(400).json({
                        status: "error",
                        message: "Invalid data",
                        errors: parsedData.error.errors,
                    });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, Company_1.default.findById(user._id)];
            case 1:
                company = _b.sent();
                if (!company) {
                    return [2 /*return*/, apiresponse_1.default.error(res, "Company not found", 404)];
                }
                _a = parsedData.data, email = _a.email, addressType = _a.addressType, address = _a.address, contactNumber = _a.contactNumber, contentType = _a.contentType, profileImage = _a.profileImage, products = _a.products, establishedYear = _a.establishedYear, description = _a.description, socialLinks = _a.socialLinks;
                company.email = email;
                company.addressType = addressType;
                if (addressType === "Physical") {
                    company.address = address;
                }
                else {
                    company.address = undefined;
                }
                company.contactNumber = contactNumber;
                company.contentType = contentType;
                if (profileImage !== undefined) {
                    company.profileImage = profileImage;
                }
                company.products = products;
                company.establishedYear = establishedYear;
                if (description !== undefined) {
                    company.description = description;
                }
                company.socialLinks = socialLinks;
                company.isProfileComplete = true;
                return [4 /*yield*/, company.save()];
            case 2:
                _b.sent();
                return [2 /*return*/, res.status(200).json({
                        status: "success",
                        message: "Company profile updated",
                        company: company,
                    })];
        }
    });
}); });
/**
 * @description Get public company profile by ID or slug
 * @route GET /api/companies/:companyId
 * @access Public
 */
exports.getCompanyProfileController = (0, asyncHandler_1.asyncWrapper)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var companyId, cacheKey, cachedProfile, company;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                companyId = req.params.companyId;
                cacheKey = "company:".concat(companyId);
                return [4 /*yield*/, redis_1.default.client.get(cacheKey)];
            case 1:
                cachedProfile = _a.sent();
                if (cachedProfile) {
                    return [2 /*return*/, apiresponse_1.default.success(res, "Company profile fetched successfully", JSON.parse(cachedProfile))];
                }
                return [4 /*yield*/, Company_1.default.findOne({
                        $or: [{ _id: companyId }, { slug: companyId }],
                        isverified: true,
                        isprofileComplete: true
                    })
                        .select("companyName email addressType address contactNumber contentType profileImage products establishedYear description socialLinks slug")];
            case 2:
                company = _a.sent();
                if (!company) {
                    return [2 /*return*/, apiresponse_1.default.error(res, "Company not found", 404)];
                }
                return [4 /*yield*/, redis_1.default.client.set(cacheKey, JSON.stringify(company), { EX: 3600 })];
            case 3:
                _a.sent();
                return [2 /*return*/, apiresponse_1.default.success(res, "Company profile fetched successfully", company)];
        }
    });
}); });
/**
 * @description List or search verified companies
 * @route GET /api/companies
 * @access Public or Authenticated
 */
exports.listCompaniesController = (0, asyncHandler_1.asyncWrapper)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
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
                    query.companyName = { $regex: search, $options: "i" };
                }
                if (contentType) {
                    query.contentType = { $elemMatch: { contentType: contentType } };
                }
                skip = (Number(page) - 1) * Number(limit);
                return [4 /*yield*/, Company_1.default.find(query)
                        .select("companyName email addressType address contactNumber contentType profileImage products establishedYear description socialLinks slug")
                        .skip(skip)
                        .limit(Number(limit))
                        .sort({ createdAt: -1 })];
            case 1:
                companies = _d.sent();
                return [4 /*yield*/, Company_1.default.countDocuments(query)];
            case 2:
                total = _d.sent();
                return [2 /*return*/, res.status(200).json({
                        success: true,
                        total: total,
                        currentPage: Number(page),
                        totalPages: Math.ceil(total / Number(limit)),
                        companies: companies,
                    })];
        }
    });
}); });
exports.updateCompanyProfileController = (0, asyncHandler_1.asyncWrapper)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var companyId, authCompanyId, parsedData, updatedCompany;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                companyId = req.params.companyId;
                authCompanyId = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString();
                if (!authCompanyId || authCompanyId !== companyId) {
                    return [2 /*return*/, apiresponse_1.default.error(res, "Unauthorized", 401)];
                }
                parsedData = profileCompletionSchema_1.companyProfileUpdateSchema.safeParse(req.body);
                if (!parsedData.success) {
                    return [2 /*return*/, res.status(400).json({
                            status: "error",
                            message: "Invalid data",
                            errors: parsedData.error.errors,
                        })];
                }
                return [4 /*yield*/, Company_1.default.findByIdAndUpdate(companyId, {
                        $set: parsedData.data
                    }, { new: true, runValidators: true })];
            case 1:
                updatedCompany = _c.sent();
                if (!updatedCompany) {
                    return [2 /*return*/, apiresponse_1.default.error(res, "Company not found", 404)];
                }
                return [2 /*return*/, apiresponse_1.default.success(res, "Company profile updated", {
                        company: updatedCompany
                    })];
        }
    });
}); });
// /**
//  * Controller to list campaigns for a company.
//  * 
//  * Access rules:
//  * - Logged in as company or influencer: full campaign details
//  * - Visitor (not logged in): limited campaign details
//  */
// export const listCompanyCampaignsController: RequestHandler = asyncWrapper(
//   async (req: Request, res: Response) => {
//     const user = req.user as { usertype?: string; companyId?: string } | undefined;
//     const companyId = req.params.companyId;
//     if (!companyId) {
//       return Apiresponse.error(res, "Company ID is required", 400);
//     }
//     // Fetch campaigns for company, sorted by newest first
//     const campaigns = await CampaignModel.find({ company: companyId }).sort({ createdAt: -1 });
//     // Define a limited view for visitors
//     const limitedCampaignView = (campaign: typeof campaigns[0]) => ({
//       _id: campaign._id,
//       title: campaign.title,
//       description: campaign.description.length > 150 ? campaign.description.slice(0, 150) + "..." : campaign.description,
//       budgetRange: campaign.budgetVisibility === "masked" ? campaign.budgetRange : undefined,
//       platforms: campaign.platforms,
//       status: campaign.status === "active" ? campaign.status : undefined,
//       startDate: campaign.startDate,
//       endDate: campaign.endDate,
//     });
//     // If user is logged in as company or influencer, send full campaigns
//     if (user && (user.usertype === "company" || user.usertype === "influencer")) {
//       // For budget, apply visibility rules
//       const fullCampaigns = campaigns.map(campaign => {
//         let budgetToShow: number | undefined;
//         if (campaign.budgetVisibility === "public") {
//           budgetToShow = campaign.budget;
//         } else if (campaign.budgetVisibility === "masked") {
//           budgetToShow = undefined; // budget hidden, range shown instead
//         } else if (campaign.budgetVisibility === "private") {
//           budgetToShow = undefined; // budget hidden entirely
//         }
//         return {
//           _id: campaign._id,
//           title: campaign.title,
//           description: campaign.description,
//           budget: budgetToShow,
//           budgetRange: campaign.budgetVisibility === "masked" ? campaign.budgetRange : undefined,
//           platforms: campaign.platforms,
//           status: campaign.status,
//           startDate: campaign.startDate,
//           endDate: campaign.endDate,
//           createdAt: campaign.createdAt,
//           updatedAt: campaign.updatedAt,
//         };
//       });
//       return Apiresponse.success(res, "Company campaigns fetched", {
//         campaigns: fullCampaigns,
//       });
//     }
//     // Visitor fallback: limited view only
//     const limitedCampaigns = campaigns.map(limitedCampaignView);
//     return Apiresponse.success(res, "Company campaigns fetched", {
//       campaigns: limitedCampaigns,
//     });
//   }
// );
