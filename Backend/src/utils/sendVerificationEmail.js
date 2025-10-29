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
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var resend_1 = require("resend");
var resend = new resend_1.Resend(process.env.RESEND_API_KEY);
var sendVerificationEmail = function (username, email, verifycode, usertype) { return __awaiter(void 0, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, resend.emails.send({
                        from: "onboarding@resend.dev",
                        to: [email],
                        subject: "SponsorFlow | Verification Code",
                        html: "\n                            <!DOCTYPE html>\n                <html lang=\"en\">\n                <head>\n                    <meta charset=\"UTF-8\">\n                    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n                    <title>Sponsorflow Verification Code</title>\n                    <style>\n                    @media screen and (max-width: 600px) {\n                    .content {\n                        width: 100% !important;\n                        display: block !important;\n                        padding: 10px !important;\n                    }\n                    .header, .body, .footer {\n                        padding: 20px !important;\n                    }\n                    }\n                </style>\n                </head>\n                <body style=\"font-family: 'Poppins', Arial, sans-serif\">\n                    <table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\n                        <tr>\n                            <td align=\"center\" style=\"padding: 20px;\">\n                                <table class=\"content\" width=\"600\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"border-collapse: collapse; border: 1px solid #cccccc;\">\n                                    <tr>\n                                        <td class=\"header\" style=\"background-color: #345C72; padding: 40px; text-align: center; color: white; font-size: 24px;\">\n                                            SponsorFlow Verification Code\n                                        </td>\n                                    </tr>\n                \n                                    <tr>\n                                        <td class=\"body\" style=\"padding: 40px; text-align: left; font-size: 16px; line-height: 1.6;\">\n                                        Hello, ".concat(username, " <br>\n                                        Thank you for registering. Please use the following verification\n                                        code to complete your registration:\n\n                                        <p>").concat(verifycode, "</p>\n                                        </td>\n                                    </tr>\n                \n                                    <tr>\n                                        <td style=\"padding: 0px 40px 0px 40px; text-align: center;\">\n                                            <!-- CTA Button -->\n                                            <table cellspacing=\"0\" cellpadding=\"0\" style=\"margin: auto;\">\n                                                <tr>\n                                                    <td align=\"center\" style=\"background-color: #345C72; padding: 10px 20px; border-radius: 5px;\">\n                                                        <a href=\"http://localhost:8001/api/auth/signup/verify/").concat(usertype, "/").concat(username, "\" target=\"_blank\" style=\"color: #ffffff; text-decoration: none; font-weight: bold;\">Verify Here</a>\n                                                    </td>\n                                                </tr>\n                                            </table>\n                                        </td>\n                                    </tr>\n                                    <tr>\n                                        <td class=\"body\" style=\"padding: 40px; text-align: left; font-size: 16px; line-height: 1.6;\">\n                                        </td>\n                                    </tr>\n                                    <!-- Footer -->\n                                    <tr>\n                                        <td class=\"footer\" style=\"background-color: #333333; padding: 40px; text-align: center; color: white; font-size: 14px;\">\n                                        Copyright &copy; 2025 | Sponsorflow\n                                        </td>\n                                    </tr>\n                                </table>\n                            </td>\n                        </tr>\n                    </table>\n                </body>\n                </html>\n            ")
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/, {
                        success: true,
                        message: "Verification email sent successfully",
                    }];
            case 2:
                error_1 = _a.sent();
                console.error("Error sending email:", error_1.message || error_1);
                return [2 /*return*/, {
                        success: false,
                        message: "Failed to send verification email",
                    }];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.default = sendVerificationEmail;
