
import mongoose,{model,Schema} from "mongoose"

export interface User extends Document{
     username : string;
     email : string;
     password: string;
     verifyCode : string;
     verifyCodeExpiry: Date;
     isVerified : boolean;
}


const userSchema = new Schema({
     username : {
          type: String,
          require: [true,"username is required"],
          unique : [true,"username already exists"],
          trim : true,
     },
     email:{
          type: String,
          require: [true, "Email is requred"],
          unique:[true,"Email already exists"],
          match: [/^\S+@\S+\.\S+$/,"Email is invalid"]
     },
     password:{
          type:String,
          require: [true,"password is required"],
     },
     verifyCode: {
          type : String,
     },
     verifyCodeExpiry: {
          type : Date,
     },
     isVerified :{
          type: Boolean,
     },
     socialMediaProfileLinks:[
          {
               platform :{
                    type: String,
                    requried: true,
               },
               link : {
                    type : String,
                    required: true,
               }
          }
     ],
     followersCount:[
          {
               platform :{
                    type: String,
                    requried: true,
               },
               count : {
                    type : Number,
                    required: true,
               }
          }   
     ],
     experienceYears : {
          type : Number,
     },
     previousSponsorships:[
          {
               company_name : {
                    type: String,
                    required: true,
               }
          }
     ],
     contentType:[
          {
               type : String,
          }
     ],
     profileImage:{
          type : String,
          default : "/default_image"
     }
},{timestamps: true});

const UserModel = mongoose.models.User || model("User",userSchema);

export default UserModel;

