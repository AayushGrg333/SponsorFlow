import passport from 'passport';
import {Strategy as LocalStrategy}  from "passport-local"
import bcrypt from "bcrypt"
import UserModel from '../models/User';
import CompanyModel from '../models/Company';

passport.use('influencer-local',
     new LocalStrategy (
          {
               usernameField: 'login',//we will use either username or email so 'login'
               passwordField : 'password'
          },
          async function userData(login, password, done){
               //done(error, user, info)
               try {
                    //decide if its an email or username? 
                    const isEmail = login.includes("@");
                    const user = await UserModel.findOne(
                         isEmail ? {email : login} : {username : login}
                    )
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
               usernameField: 'login',//we will use either username or email so 'login'
               passwordField : 'password'
          },
          async function userData(login, password, done){
               //done(error, user, info)
               try {
                    //decide if its an email or username? 
                    const isEmail = login.includes("@");
                    const user = await CompanyModel.findOne(
                         isEmail ? {email : login} : {companyName : login}
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

export  default passport