import { Response } from "express";
export class Apiresponse {
     static success(
          res: Response,
          message: string = "Success",
          data: any = null
     ) {
          return res.status(200).json({
               status: "success",
               message,
               data,
          });
     }

     static created(
          res: Response,
          data: any = null,
          message: string = "Resource created successfully"
     ) {
          return res.status(201).json({
               status: "success",
               message,
               data,
          });
     }

     static noContent(res: Response) {
          return res.status(204).send();
     }

     static error(res: Response, message: string, statusCode: number = 500) {
          return res.status(statusCode).json({
               status: "error",
               message,
          });
     }
}
export default Apiresponse;
