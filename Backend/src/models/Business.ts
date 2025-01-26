import mongoose, { model, Schema, Document } from "mongoose";

export interface Business extends Document{

}

const businessSchema = new Schema({
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
        address:{
          type : String,
          required: [true, "location is requied"],//todo: online should have online option

        }
})