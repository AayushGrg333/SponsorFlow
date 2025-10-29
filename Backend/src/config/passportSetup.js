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
var passport_1 = require("passport");
var bcrypt_1 = require("bcrypt");
var User_1 = require("../models/User");
var Company_1 = require("../models/Company");
var passport_local_1 = require("passport-local");
var passport_jwt_1 = require("passport-jwt");
var passport_google_oauth20_1 = require("passport-google-oauth20");
var options = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_OR_KEY,
};
passport_1.default.use(new passport_jwt_1.Strategy(options, function name(payload, done) {
    return __awaiter(this, void 0, void 0, function () {
        var model, user, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    model = payload.usertype === "company" ? Company_1.default : User_1.default;
                    return [4 /*yield*/, model.findById(payload.id)];
                case 1:
                    user = _a.sent();
                    if (user) {
                        return [2 /*return*/, done(null, user)];
                    }
                    return [2 /*return*/, done(null, false)];
                case 2:
                    error_1 = _a.sent();
                    return [2 /*return*/, done(error_1, false)];
                case 3: return [2 /*return*/];
            }
        });
    });
}));
passport_1.default.use("influencer-local", new passport_local_1.Strategy({
    usernameField: "identifier", //we will use either username or email so 'login'
    passwordField: "password",
}, function userData(identifier, password, done) {
    return __awaiter(this, void 0, void 0, function () {
        var isEmail, user, isValid, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    isEmail = identifier.includes("@");
                    user = void 0;
                    if (!!isEmail) return [3 /*break*/, 2];
                    return [4 /*yield*/, User_1.default.findOne({ username: identifier })];
                case 1:
                    user = _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, User_1.default.findOne({ email: identifier })];
                case 3:
                    user = _a.sent();
                    _a.label = 4;
                case 4:
                    if (!user)
                        return [2 /*return*/, done(null, false, { message: "User not found" })];
                    return [4 /*yield*/, bcrypt_1.default.compare(password, user.password)];
                case 5:
                    isValid = _a.sent();
                    if (!isValid) {
                        return [2 /*return*/, done(null, false, { message: "incorrect password" })];
                    }
                    return [2 /*return*/, done(null, user)];
                case 6:
                    error_2 = _a.sent();
                    console.error("Error during login", error_2);
                    return [2 /*return*/, done(error_2)];
                case 7: return [2 /*return*/];
            }
        });
    });
}));
passport_1.default.use("company-local", new passport_local_1.Strategy({
    usernameField: "identifier", //we will use either username or email so 'login'
    passwordField: "password",
}, function userData(identifier, password, done) {
    return __awaiter(this, void 0, void 0, function () {
        var user, isValid, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, Company_1.default.findOne({ email: identifier })];
                case 1:
                    user = _a.sent();
                    if (!user)
                        return [2 /*return*/, done(null, false, { message: "company not found" })];
                    return [4 /*yield*/, bcrypt_1.default.compare(password, user.password)];
                case 2:
                    isValid = _a.sent();
                    if (!isValid) {
                        return [2 /*return*/, done(null, false, { message: "incorrect password" })];
                    }
                    return [2 /*return*/, done(null, user)];
                case 3:
                    error_3 = _a.sent();
                    console.error("Error during login", error_3);
                    return [2 /*return*/, done(error_3)];
                case 4: return [2 /*return*/];
            }
        });
    });
}));
passport_1.default.use("influencer-google", new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/api/influencer/oauth2/google/callback",
}, function (accessToken, refreshToken, profile, done) { return __awaiter(void 0, void 0, void 0, function () {
    var existingUser, rawName, usernameCreation, random, newUsername, newUser, error_4;
    var _a, _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 3, , 4]);
                return [4 /*yield*/, User_1.default.findOne({
                        googleId: profile.id,
                    })];
            case 1:
                existingUser = _f.sent();
                if (existingUser)
                    return [2 /*return*/, done(null, existingUser)];
                rawName = profile.displayName || "user";
                usernameCreation = rawName.replace(/\s+/g, "");
                random = Math.floor(Math.random() * 1000) + 1;
                newUsername = usernameCreation + random.toString();
                newUser = new User_1.default({
                    googleId: profile.id,
                    email: (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value,
                    username: newUsername,
                    displayName: profile.displayName,
                    isVerified: true,
                    profileImage: (_b = profile.photos) === null || _b === void 0 ? void 0 : _b[0].value,
                    realName: {
                        familyName: (_c = profile.name) === null || _c === void 0 ? void 0 : _c.familyName,
                        middleName: (_d = profile.name) === null || _d === void 0 ? void 0 : _d.middleName,
                        givenName: (_e = profile.name) === null || _e === void 0 ? void 0 : _e.givenName,
                    },
                });
                return [4 /*yield*/, newUser.save()];
            case 2:
                _f.sent();
                return [2 /*return*/, done(null, newUser)];
            case 3:
                error_4 = _f.sent();
                console.error("Error during OAuth google", error_4);
                done(error_4);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); }));
passport_1.default.use("company-google", new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/api/company/oauth2/google/callback",
}, function (accessToken, refreshToken, profile, done) { return __awaiter(void 0, void 0, void 0, function () {
    var existingCompany, newUser, error_5;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                return [4 /*yield*/, Company_1.default.findOne({
                        googleId: profile.id,
                    })];
            case 1:
                existingCompany = _c.sent();
                if (existingCompany)
                    return [2 /*return*/, done(null, existingCompany)];
                newUser = new Company_1.default({
                    googleId: profile.id,
                    email: (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value,
                    companyName: profile.displayName,
                    isVerified: true,
                    profileImage: (_b = profile.photos) === null || _b === void 0 ? void 0 : _b[0].value,
                });
                return [4 /*yield*/, newUser.save()];
            case 2:
                _c.sent();
                return [2 /*return*/, done(null, newUser)];
            case 3:
                error_5 = _c.sent();
                console.error("Error during OAuth google", error_5);
                done(error_5);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); }));
exports.default = passport_1.default;
