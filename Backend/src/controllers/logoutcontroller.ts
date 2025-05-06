import { RequestHandler } from "express"


const logoutcontroller : RequestHandler = (req,res) =>{
     res.clearCookie("refreshToken",{
          httpOnly : true,
          sameSite : 'strict'
     })
     res.clearCookie("accessToken",{
           httpOnly : true,
          sameSite : 'strict'
     })
     res.status(200).json({
          success : true,
          message : "logged out successfully"
     });
}

export default logoutcontroller