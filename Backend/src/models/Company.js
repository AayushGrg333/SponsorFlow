"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var ContentSchema = new mongoose_1.Schema({
    content: {
        type: String,
        required: true,
    },
});
var socialLinkSchema = new mongoose_1.Schema({
    types: {
        type: String,
        enum: ["website", "instagram", "linkedin", "twitter", "youtube", "facebook"],
    },
    url: {
        type: String,
    }
});
var companySchema = new mongoose_1.Schema({
    usertype: {
        type: String,
        default: "company"
    },
    isProfileComplete: {
        type: Boolean,
        default: false,
    },
    companyName: {
        type: String,
        required: [true, "company name is required"],
        unique: [true, "company name already exists"],
        trim: true,
        match: [
            /^[a-zA-Z]+(?: [a-zA-Z]+)*$/,
            "company name can only contain letters and spaces",
        ],
        minlength: [3, "Company name must be at least 3 characters"],
        maxlength: [30, "Company name cannot be longer than 30 characters"],
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
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
    verifyCode: {
        type: String,
    },
    verifyCodeExpiry: {
        type: Date,
    },
    googleId: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    addressType: {
        type: String,
        enum: ["Online", "Physical"],
        required: function () {
            return this.isProfileComplete;
        }
    },
    address: {
        type: String,
        required: function () {
            return this.isProfileComplete;
        },
    },
    contactNumber: {
        type: String,
        required: function () {
            return this.isProfileComplete;
        },
        match: [/^\d{10}$/, "Contact number should be a 10-digit number"],
    },
    contentType: [ContentSchema],
    profileImage: {
        type: String,
        default: "/default_image",
    },
    products: [{ type: String }],
    establishedYear: {
        type: Number,
    },
    description: {
        type: String,
    },
    socialLinks: [socialLinkSchema]
}, { timestamps: true });
// Pre-save hook to generate slug and set the username field
companySchema.pre("save", function (next) {
    if (!this.slug || this.isModified("companyName") && this.companyName) {
        this.slug = this.companyName.toLowerCase().replace(/\s+/g, "-");
    }
    next();
});
var CompanyModel = mongoose_1.default.models.Company || (0, mongoose_1.model)("Company", companySchema);
exports.default = CompanyModel;
