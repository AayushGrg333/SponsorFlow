import mongoose from "mongoose";
import { config } from "./config";

async function connectDB():Promise<void> {
     if(mongoose.connection.readyState !== 0){
          console.log("Database is already connected.");
          return;
     }
     try {
          if(!config.MONGODB_URL){
               throw new Error("MONGODB_URL is not defined in the environment variables.")
          }

           await mongoose.connect(config.MONGODB_URL);
           console.log("Database Connected Successfully");
     } catch (error) {
          console.log("Database connection failed",error);
          process.exit(1);
     }
}

export default connectDB;