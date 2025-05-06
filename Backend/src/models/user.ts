import mongoose, { model, Schema, Document } from "mongoose";
import {
    ContentType,
    FollowersCount,
    PreviousSponsorships,
    SocialMediaProfileLinks,
} from "../interfaces/userinterfaces";

export interface User extends Document {
    usertype : "influencer",
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    socialMediaProfileLinks: SocialMediaProfileLinks[];
    followersCount: FollowersCount[];
    experienceYears: number;
    previousSponsorships: PreviousSponsorships[];
    contentType: ContentType[];
    profileImage: string;
}

const ContentSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
});

// Main userSchema
const userSchema = new Schema(
    {   
        usertype: {
            type : String,
            default  : "influencer"
        },
        isProfileComplete:{
            default : false,
            type : Boolean,
        },
        username: {
            type: String,
            required: [true, "username is required"],
            unique: [true, "Username already exists"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: [true, "Email already exists"],
            match: [/^\S+@\S+\.\S+$/, "Email is invalid"],
        },
        password: {
            type: String,
            required: [true, "password is required"],
        },
        verifyCode: {
            type: String,
        },
        verifyCodeExpiry: {
            type: Date,
        },
        isVerified: {
            type: Boolean,
            default : false
        },
        bio:{
            type: String
        },
        realName: {
            type: String,
            match: [
                /^[a-zA-Z]+(?: [a-zA-Z]+)*$/,
                "name can only contain letters and spaces",
            ],
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
        followersCount: [
            {
                platform: {
                    type: String,
                    required: true,
                },
                count: {
                    type: Number,
                    required: true,
                },
            },
        ],
        experienceYears: {
            type: Number,
            default: 0,
        },
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
    },
    { timestamps: true }
);



const UserModel = mongoose.models.User || model<User>("User", userSchema);

export default UserModel;
