import mongoose,{model,Schema} from "mongoose"

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
     }
})