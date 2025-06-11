import { Response } from "express";

class Apiresponse{
     static success(res: Response , message : string, data : any  = null) {
          res.status(200).json({
               "success" : true,
               message,
               data,
          })
     }

     static error(res : Response, message : string, statuscode : number ){
          res.status(statuscode).json({
               "success" : false,
               message,
          })
     }

     static created(res: Response, message: string, data: any = null) {
          res.status(201).json({
               "success" : true,
               message,
               data,
          });
     }

    }

    export default Apiresponse;