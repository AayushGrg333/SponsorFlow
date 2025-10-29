"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var ContentSchema = new mongoose_1.Schema({
    content: {
        type: String,
        required: true,
    },
});
var platformStatsSchema = new mongoose_1.Schema({
    platform: {
        type: String,
        enum: ["instagram", "linkedin", "youtube", "facebook", "tiktok"],
        required: true,
    },
    count: {
        type: Number,
        required: true,
        min: [0, "Follower count cannot be negative"],
    },
    platformVerified: {
        type: Boolean,
        default: false,
    },
}, {
    _id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Main userSchema
var userSchema = new mongoose_1.Schema({
    usertype: {
        type: String,
        default: "influencer",
    },
    isProfileComplete: {
        default: false,
        type: Boolean,
    },
    username: {
        type: String,
        required: [true, "username is required"],
        unique: [true, "Username already exists"],
        trim: true,
    },
    displayName: {
        type: String,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email already exists"],
        match: [/^\S+@\S+\.\S+$/, "Email is invalid"],
    },
    password: {
        type: String,
    },
    googleId: {
        type: String,
    },
    verifyCode: {
        type: String,
    },
    verifyCodeExpiry: {
        type: Date,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    bio: {
        type: String,
    },
    realName: {
        familyName: String,
        middleName: String,
        givenName: String,
    },
    socialMediaProfileLinks: [
        {
            platform: {
                type: String,
                required: true,
            },
            link: {
                type: String,
                required: true,
            },
        },
    ],
    experienceYears: {
        type: Number,
        default: 0,
    },
    platforms: { type: [platformStatsSchema], default: [] },
    previousSponsorships: [
        {
            company_name: {
                type: String,
            },
        },
    ],
    contentType: [ContentSchema],
    profileImage: {
        type: String,
        default: "/default_image",
    },
}, { timestamps: true });
platformStatsSchema.virtual("tier").get(function () {
    if (this.count < 5000)
        return "Starter";
    if (this.count < 25000)
        return "Emerging";
    if (this.count < 100000)
        return "Growing";
    if (this.count < 500000)
        return "Established";
    return "Influencer+";
});
userSchema.pre("save", function (next) {
    this.platforms = this.platforms.map(function (p) {
        var _a;
        return ({
            platform: p.platform,
            count: p.count,
            platformVerified: (_a = p.platformVerified) !== null && _a !== void 0 ? _a : false,
        });
    });
    next();
});
userSchema.virtual("primaryTier").get(function () {
    if (this.platforms.length === 0)
        return undefined;
    var top = this.platforms.reduce(function (a, b) { return (a.count > b.count ? a : b); });
    return top.tier;
});
var UserModel = mongoose_1.default.models.User || (0, mongoose_1.model)("User", userSchema);
exports.default = UserModel;
