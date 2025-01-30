import mongoose, { model, Schema, Document } from "mongoose";
import { ContentType, FollowersCount, PreviousSponsorships, SocialMediaProfileLinks } from "../interfaces/user.interfaces";


export interface User extends Document {
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
        username: {
            type: String,
            required: [true, "username is required"],
            unique: [true, "username already exists"],
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
            default : 0,
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
userSchema.index({email : 1});
userSchema.index({username : 1});


const UserModel = mongoose.models.User || model<User>("User", userSchema);

export default UserModel;
