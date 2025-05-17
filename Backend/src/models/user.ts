import mongoose, { model, Schema, Document } from "mongoose";
import {
    ContentType,
    FollowersCount,
    PreviousSponsorships,
    SocialMediaProfileLinks,
} from "../interfaces/userinterfaces";

interface Realname {
    realName: {
        familyName: string;
        givenName: string;
        middleName : string;
    };
}

export interface User extends Document {
    usertype: string;
    username: string;
    displayName: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    googleId: string;
    isVerified: boolean;
    socialMediaProfileLinks: SocialMediaProfileLinks[];
    followersCount: FollowersCount[];
    experienceYears: number;
    previousSponsorships: PreviousSponsorships[];
    contentType: ContentType[];
    realName: Realname;
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
            middleName : String,
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
