import 'dotenv/config';

function getEnvVar(key: string,required = true): string{
     const value = process.env[key];
     if(!value){
          throw new Error("Missing required env variable : ${key}")
     }
     return value!;
     }


export const config = { 
     PORT : getEnvVar("PORT"),
     MONGODB_URL : getEnvVar("MONGODB_URL"),
     RESEND_API_KEY : getEnvVar("RESEND_API_KEY"),
     JWT_SECRET_OR_KEY : getEnvVar("JWT_SECRET_OR_KEY"),
JWT_REFRESH_SECRET : getEnvVar("JWT_REFRESH_SECRET"),
JWT_ACCESS_SECRET : getEnvVar("JWT_ACCESS_SECRET"),
GOOGLE_CLIENT_ID : getEnvVar("GOOGLE_CLIENT_ID"),
     GOOGLE_CLIENT_SECRET : getEnvVar("GOOGLE_CLIENT_SECRET"),
}