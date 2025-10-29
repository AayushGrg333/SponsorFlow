"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var verifytoken_1 = require("../middlewares/verifytoken");
var router = express_1.default.Router();
var campaignControllers_1 = require("../controllers/feature/campaignControllers");
//routes
router.get("/campaigns", campaignControllers_1.listCampaignsController);
router.get("/campaigns/ :campaignId", campaignControllers_1.getCampaignController);
router.post("/campaigns", verifytoken_1.default, campaignControllers_1.createCampaignController);
router.put("/campaigns/:campaignId", verifytoken_1.default, campaignControllers_1.updateCampaignController);
router.delete("/campaigns/:campaignId", verifytoken_1.default, campaignControllers_1.deleteCampaignController);
router.get("/companies/:companyId/campaigns", campaignControllers_1.getCampaignByCompanyController);
exports.default = router;
