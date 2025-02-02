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
            match: [/^[a-zA-Z]+(?: [a-zA-Z]+)*$/, "Username can only contain letters and spaces"],
            minlength: [3, "Username must be at least 3 characters"],
            maxlength: [30, "Username cannot be longer than 30 characters"]
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            required : [true,"Slug is required"]
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
        address:{
          type : String,
          required: [true, "location is requied"],
          enum : ["Online", "Physical"]
        },
        contactNumber : {
            type: String,
            required : true,
            match: [/^\d{10}$/, "Contact number should be a 10-digit number"]
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
        description : {
            type: String,
            required: true,
        }
},{timestamps : true})

//pre-save hook to generate slug
companySchema.pre("save",function(next){
    if(this.isModified('username')){
        this.slug = this.username.toLowerCase().replace(/\s+/g,'-');
    }
    next()
})

const CompanyModel = mongoose.models.Company || model("Company",companySchema);

export default CompanyModel;

