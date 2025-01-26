import mongoose, { model, Schema, Document } from "mongoose";

export interface Company extends Document{

}

const ContentSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
});

const companySchema = new Schema({
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
        },
        contact_number : {
            type: String,
            required : true,
        },
        contentType: [ContentSchema], 
        profileImage: {
            type: String,
            default: "/default_image",
        },
        products : [
            {type: String}
        ],
        establishedYear: {
            type: Number,
        },
        Description : {
            type: String,
            required: true,
        }
},{timestamps : true})

const CompanyModel = mongoose.models.Company || model("Company",companySchema);

export default CompanyModel;

