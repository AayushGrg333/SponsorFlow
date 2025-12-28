import mongoose, { model, Schema, Document, ObjectId } from "mongoose";

export interface Company extends Document {
    _id: string | ObjectId;
    usertype : "company";
    isProfileComplete : boolean;
    companyName : string;
    slug : string;
    email : string;
    password : string;
    verifyCode : string;
    verifyCodeExpiry : Date;
    isVerified : boolean;
    googleId : string;
    addressType : addresstype;
    address : string;
    contactNumber : string;
    contentType : contentType[];
    profileImage : string;
    products : Product[];
    establishedYear : number;
    description : string;
     socialLinks: SocialLink[];

}

export type SocialPlatform = "website" | "instagram" | "linkedin" | "twitter" | "youtube" | "facebook";
export type addresstype = 'Physical' | 'Online'
export interface SocialLink {
  type: SocialPlatform;
  url: string;
}


const ContentSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
})

type contentType = {
    name: string;
}

type Product = {
    name : string;
}

const socialLinkSchema = new Schema({
    types : {
        type : String,
        enum: ["website", "instagram", "linkedin", "twitter", "youtube", "facebook"],
    },
    url : {
        type : String,
    }
})



const companySchema = new Schema(
    {
        usertype: {
            type : String,
            default  : "company"
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
        googleId : {
            type : String,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        addressType:{
            type : String,
            enum : ["Online","Physical"],
            required : false,
        },
        address: {
            type: String,
            required: function (this: any) {
                return this.addressType === "Physical";
            },
        },
        contactNumber: {
            type: String,
            required: function (this: any) {
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
        socialLinks : [socialLinkSchema]

    },
    { timestamps: true }
);

// Pre-save hook to generate slug and set the username field
companySchema.pre("save", function (next) {
    if (!this.slug || this.isModified("companyName") && this.companyName) {
        this.slug = this.companyName.toLowerCase().replace(/\s+/g, "-");

    }
    next();
});

const CompanyModel = mongoose.models.Company || model("Company", companySchema);

export default CompanyModel;
