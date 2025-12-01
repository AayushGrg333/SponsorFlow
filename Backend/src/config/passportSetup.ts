import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import bcrypt from "bcrypt";
import UserModel from "../models/user";
import CompanyModel from "../models/Company";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import {
    Strategy as GoogleStrategy,
    Profile,
    VerifyCallback,
} from "passport-google-oauth20";

let options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_OR_KEY!,
};

passport.use(
    new JwtStrategy(options, async function name(payload, done) {
        try {
            const model =
                payload.usertype === "company" ? CompanyModel : UserModel;

            const user = await model.findById(payload.id);
            if (user) {
                return done(null, user);
            }

            return done(null, false);
        } catch (error) {
            return done(error, false);
        }
    })
);

passport.use(
    "influencer-local",
    new LocalStrategy(
        {
            usernameField: "identifier", //we will use either username or email so 'login'
            passwordField: "password",
        },
        async function userData(identifier, password, done) {
            //done(error, user, info)
            try {
                const isEmail = identifier.includes("@");
                let user;
                if (!isEmail) {
                    user = await UserModel.findOne({ username: identifier });
                } else {
                    user = await UserModel.findOne({ email: identifier });
                }

                if (!user)
                    return done(null, false, { message: "User not found" });

                const isValid = await bcrypt.compare(password, user.password);
                if (!isValid) {
                    return done(null, false, { message: "incorrect password" });
                }

                return done(null, user);
            } catch (error) {
                console.error("Error during login", error);
                return done(error);
            }
        }
    )
);

passport.use(
    "company-local",
    new LocalStrategy(
        {
            usernameField: "identifier", //we will use either username or email so 'login'
            passwordField: "password",
        },
        async function userData(identifier, password, done) {
            //done(error, user, info)
            try {
                //decide if its an email or username?

                const user = await CompanyModel.findOne({ email: identifier });
                if (!user)
                    return done(null, false, { message: "company not found" });

                const isValid = await bcrypt.compare(password, user.password);
                if (!isValid) {
                    return done(null, false, { message: "incorrect password" });
                }

                return done(null, user);
            } catch (error) {
                console.error("Error during login", error);
                return done(error);
            }
        }
    )
);
passport.use(
    "influencer-google",
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL:
                "http://localhost:8000/api/influencer/oauth2/google/callback",
        },
        async (
            accessToken: string,
            refreshToken: string,
            profile: Profile,
            done: VerifyCallback
        ) => {
            try {
                // Check existing user by googleId
                const existingUser = await UserModel.findOne({
                    googleId: profile.id,
                });
                if (existingUser) return done(null, existingUser);

                // Prepare username
                const rawName = profile.displayName || "user";
                const usernameCreation = rawName.replace(/\s+/g, "");
                const random = Math.floor(Math.random() * 1000) + 1;
                const newUsername = usernameCreation + random.toString();

                // Create new user
                const newUser = new UserModel({
                    googleId: profile.id,
                    email: profile.emails?.[0].value,
                    username: newUsername,
                    displayName: profile.displayName,
                    isVerified: true,
                    profileImage: profile.photos?.[0].value,
                    realName: {
                        familyName: profile.name?.familyName,
                        middleName: profile.name?.middleName,
                        givenName: profile.name?.givenName,
                    },
                });

                await newUser.save();
                return done(null, newUser);
            } catch (error) {
                console.error("Error during OAuth google", error);
                done(error);
            }
        }
    )
);

passport.use(
    "company-google",
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL:
                "http://localhost:8000/api/company/oauth2/google/callback",
        },
        async (
            accessToken: string,
            refreshToken: string,
            profile: Profile,
            done: VerifyCallback
        ) => {
            try {
                // Check existing user by googleId
                const existingCompany = await CompanyModel.findOne({
                    googleId: profile.id,
                });
                if (existingCompany) return done(null, existingCompany);


                // Create new user
                const newUser = new CompanyModel({
                    googleId: profile.id,
                    email: profile.emails?.[0].value,
                    companyName : profile.displayName,
                    isVerified: true,
                    profileImage: profile.photos?.[0].value,
                });

                await newUser.save();
                return done(null, newUser);
            } catch (error) {
                console.error("Error during OAuth google", error);
                done(error);
            }
        }
    )
);

export default passport;
