import dotenv from "dotenv"
dotenv.config();

import passport from 'passport';
import bcrypt from "bcrypt"
import UserModel from '../models/User';
import CompanyModel from '../models/Company';
import {Strategy as LocalStrategy}  from "passport-local"
import { Strategy as JwtStrategy,ExtractJwt } from 'passport-jwt';
import { GoogleStrategy } from "passport-google-oidc"


let options = {
     jwtFromRequest  : ExtractJwt.fromAuthHeaderAsBearerToken(),
     secretOrKey : process.env.JWT_SECRET!,
}


passport.use(
     new JwtStrategy(
          options,
          async function name(payload,done) {
               try {
                    const model = payload.usertype === "company" ? CompanyModel : UserModel  

                    const user = await model.findById(payload.id);
                    if(user){
                         return done(null,user);
                    }

                    return done(null,false);
               } catch (error) {
                    return done(error,false);
               }
          }
     )
)

passport.use('influencer-local',
     new LocalStrategy (
          {
               usernameField: 'identifier',//we will use either username or email so 'login'
               passwordField : 'password'
          },
          async function userData(identifier, password, done){
               //done(error, user, info)
               try {
                    const isEmail = identifier.includes("@");
                    let user;
                    if(!isEmail){
                         user = await UserModel.findOne({username : identifier})
                    }else{
                          user = await UserModel.findOne({email : identifier})
                    }
                    
                    if(!user) return done(null, false, {message : "User not found"});

                    const isValid = await bcrypt.compare(password,user.password);
                    if(!isValid){
                         return done(null,false,{message : "incorrect password"})
                    }

                    return done(null,user)
               } catch (error) {
                    console.error("Error during login",error);
                    return done(error);
               }
          }
     )
)

passport.use('company-local',
     new LocalStrategy (
          {
               usernameField: 'identifier',//we will use either username or email so 'login'
               passwordField : 'password'
          },
          async function userData(identifier, password, done){
               //done(error, user, info)
               try {
                    //decide if its an email or username? 

                    const isEmail = identifier.includes("@");
                    console.log(isEmail)
                    const user = await CompanyModel.findOne(
                         isEmail ? {email : identifier} : {companyName : identifier}
                    )
                    if(!user) return done(null, false, {message : "company not found"});

                    const isValid = await bcrypt.compare(password,user.password);
                    if(!isValid){
                         return done(null,false,{message : "incorrect password"})
                    }

                    return done(null,user)
               } catch (error) {
                    console.error("Error during login",error);
                    return done(error);
               }
          }
     )
)

passport.use(new GoogleStrategy(
     {
          clientID: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          callbackURL: '/oauth2/redirect/google',
          issuer : "https://accounts.google.com"
     },
     async function verify (issuer,profile,done){
          try {
               
          } catch (error) {
               
          }
     }

))









export  default passport