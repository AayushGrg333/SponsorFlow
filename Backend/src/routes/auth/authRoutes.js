"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var signupVerifyController_1 = require("../../controllers/auth/signupVerifyController");
var influencerAuth_1 = require("../../controllers/auth/influencerAuth");
var refreshTokenController_1 = require("../../controllers/refreshTokenController");
var ratelimiter_1 = require("../../middlewares/ratelimiter");
var router = express_1.default.Router();
//to verify signup code
router.post("/signup/verify/:usertype/:username", ratelimiter_1.rateLimiter, signupVerifyController_1.verifySignupCode);
router.post("/signup/resend-verify/:usertype/:username", ratelimiter_1.rateLimiter, signupVerifyController_1.resendVerifyCode);
// to verify login auths
router.post('/login', ratelimiter_1.rateLimiter, influencerAuth_1.loginController);
router.post('/logout', ratelimiter_1.rateLimiter, influencerAuth_1.logoutcontroller);
router.post('/forgot-password');
//refresh token endpoint
router.post('/refresh-token', refreshTokenController_1.default);
exports.default = router;
