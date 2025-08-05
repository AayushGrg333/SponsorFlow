import mongoose, { model, Schema, Document } from "mongoose";
import {
     ContentType,
     PreviousSponsorships,
     SocialMediaProfileLinks,
} from "../interfaces/userinterfaces";

interface Realname {
     realName: {
          familyName: string;
          givenName: string;
          middleName: string;
     };
}

export type SocialPlatform =
     | "website"
     | "instagram"
     | "linkedin"
     | "twitter"
     | "youtube"
     | "facebook";
export type TierLabel =
     | "Starter"
     | "Emerging"
     | "Growing"
     | "Established"
     | "Influencer+";
export interface PlatformStats {
     platform: SocialPlatform;
     count: number;
     readonly tier?: TierLabel;
     platformVerified: boolean;
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
     experienceYears: number;
     previousSponsorships: PreviousSponsorships[];
     contentType: ContentType[];
     realName: Realname;
     profileImage: string;
     platforms: PlatformStats[];
}



const ContentSchema = new Schema({
     content: {
          type: String,
          required: true,
     },
});

const platformStatsSchema = new Schema<PlatformStats>(
     {
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
     },
     {
          _id: false,
          toJSON: { virtuals: true },
          toObject: { virtuals: true },
     }
);

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
     },
     { timestamps: true }
);

platformStatsSchema.virtual("tier").get(function (this: PlatformStats) {
  if (this.count < 5_000) return "Starter";
  if (this.count < 25_000) return "Emerging";
  if (this.count < 100_000) return "Growing";
  if (this.count < 500_000) return "Established";
  return "Influencer+";
});
userSchema.pre<User>("save", function (next) {
     this.platforms = this.platforms.map((p) => ({
          platform: p.platform,
          count: p.count,
          platformVerified: p.platformVerified ?? false,
     }));
     next();
});

userSchema.virtual("primaryTier").get(function (this: User) {
     if (this.platforms.length === 0) return undefined;
     const top = this.platforms.reduce((a, b) => (a.count > b.count ? a : b));
     return top.tier;
});




const UserModel = mongoose.models.User || model<User>("User", userSchema);

export default UserModel;
