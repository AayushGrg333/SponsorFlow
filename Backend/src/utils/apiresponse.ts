import { Response } from "express";

class Apiresponse{
     static success(res: Response , data : any , message : string) {
          res.status(200).json({
               status : "success",
               message,
               data,
          })
     }

     static error(res : Response, message : string, statuscode : number ){
          res.status(statuscode).json({
               status : "Error",
               message,
          })
     }

     
     
     
}