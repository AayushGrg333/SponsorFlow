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
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var companyAuth_1 = require("../controllers/auth/companyAuth");
var passport_1 = require("passport");
var verifytoken_1 = require("../middlewares/verifytoken");
var companyProfile_1 = require("../controllers/profile/companyProfile");
var router = express_1.default.Router();
//auth
router.post('/auth/sign-up', companyAuth_1.companySignupController);
router.get('/auth/google', passport_1.default.authenticate('company-google', {
    scope: ['profile', 'email'],
    session: false,
}));
router.get('/oauth2/google/callback', function (req, res, next) {
    passport_1.default.authenticate("company-google", function (err, company, info) {
        var _a, _b;
        if (err || !company) {
            console.error("google signin failed", err);
            return res.status(401).json({
                success: false,
                message: "Error signing up with google"
            });
        }
        req.user = __assign(__assign({}, (_b = (_a = company.toObject) === null || _a === void 0 ? void 0 : _a.call(company)) !== null && _b !== void 0 ? _b : company), { role: "company" });
        return (0, companyAuth_1.CompanyCallbackController)(req, res, next);
    })(req, res, next);
});
//profile
router.post('/profile', verifytoken_1.default, companyProfile_1.companyProfileSetupController);
router.get('/profile/:companyId', verifytoken_1.default, companyProfile_1.getCompanyProfileController);
router.get('/profile/me', verifytoken_1.default, companyProfile_1.listCompaniesController);
router.get('/profile/update-profile/:companyId', verifytoken_1.default, companyProfile_1.updateCompanyProfileController);
exports.default = router;
