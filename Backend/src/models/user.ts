
import {model,Schema} from "mongoose"




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
     social_media_profile_links:{
          facebook:{
               type:String,
          },
          youtube:{
               type: String,
          },
          tiktok:{
               type: String,
          },
          x:{
               type: String,
          },
          twitch :{
               type:String
          },
          linkedin :{
               type:String
          }

     },
     followers_count:{
          facebook:{
               type:Number,
          },
          youtube:{
               type: Number,
          },
          tiktok:{
               type: Number,
          },
          x:{
               type: Number,
          },
          twitch :{
               type:Number
          },
          linkedin :{
               type:Number
          }   
     },
     experience_years : {
          type : Number,
     },
     previous_sponsorships:[
          {
               company_name : {
                    type: String,
                    required: true,
               }
          }
     ],
     content_type:[
          {
               type : String,
          }
     ],
     profile_image:{
          type : String,
          default : "/default_image"
     }
},{timestamps: true});

const UserModel = model("User",userSchema);

export default UserModel;

