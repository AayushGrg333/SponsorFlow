"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var influencerAuth_1 = require("../controllers/auth/influencerAuth");
var influencerProfile_1 = require("../controllers/profile/influencerProfile");
var passport_1 = require("passport");
var verifytoken_1 = require("../middlewares/verifytoken");
var router = express_1.default.Router();
router.post("/auth/sign-up", influencerAuth_1.influencerSignupController);
router.get("/auth/google", passport_1.default.authenticate("influencer-google", {
    scope: ["profile", "email"],
    session: false,
}));
router.get("/oauth2/google/callback", function (req, res, next) {
    passport_1.default.authenticate("influencer-google", { session: false }, function (err, user, info) {
        if (err || !user) {
            console.error("login failed", err || info);
            return res.status(400).json({
                success: false,
                message: "Unable to signup with Google",
            });
        }
        req.user = user; //manually attacted the user
        next();
        return (0, influencerAuth_1.influencerCallbackController)(req, res, next);
    })(req, res, next);
});
//profile
router.post("/profile", verifytoken_1.default, influencerProfile_1.influencerProfileSetupController);
router.get("/profile/:influencerId", verifytoken_1.default, influencerProfile_1.getInfluencerProfileController);
router.put("/profile/:influencerId", verifytoken_1.default, influencerProfile_1.updateInfluencerProfileController);
router.get("/profile/me", verifytoken_1.default, influencerProfile_1.listInfluencersController);
router.get("/profile/:influencerId/campaigns", verifytoken_1.default, influencerProfile_1.listInfluencerCampaignsController);
exports.default = router;
