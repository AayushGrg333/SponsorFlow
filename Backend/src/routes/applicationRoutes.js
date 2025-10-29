"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var verifytoken_1 = require("../middlewares/verifytoken");
var applicationControllers_1 = require("../controllers/feature/applicationControllers");
var router = express_1.default.Router();
//routes
router.post("/campaigns/:campaignId/applications", verifytoken_1.default, applicationControllers_1.createApplication);
router.get("/campaigns/:campaignId/applications", verifytoken_1.default, applicationControllers_1.getApplicationsByCampaign);
router.get("/applications/:applicationId", verifytoken_1.default, applicationControllers_1.getApplicationDetails);
router.patch("/applications/:applicationId/status", verifytoken_1.default, applicationControllers_1.updateApplicationStatus);
router.delete("/applications/:applicationId", verifytoken_1.default, applicationControllers_1.deleteApplication);
router.get("/influencers/:influencerId/applications", verifytoken_1.default, applicationControllers_1.getApplicationsByInfluencer);
exports.default = router;
