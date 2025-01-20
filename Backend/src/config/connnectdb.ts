import dotenv from 'dotenv';
dotenv.config();
import mongoose from "mongoose";

async function connectDB():Promise<void> {
     if(mongoose.connection.readyState !== 0){
          console.log("Database is already connected.");
          return;
     }
     try {
          if(!process.env.MONGODB_URL){
               throw new Error("MONGODB_URL is not defined in the environment variables.")
          }

           await mongoose.connect(process.env.MONGODB_URL!);
           console.log("Database Connected Successfully");
     } catch (error) {
          console.log("Database connection failed",error);
          process.exit(1);
     }
}

export default connectDB;