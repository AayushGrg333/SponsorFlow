import { RequestHandler } from "express";

function checkRole(role: "company" | "influencer"): RequestHandler {
     return (req, res, next) => {
          try {
               const user = (req as any).user;
               if (!user || user.role !== role) {
                    res.status(403).json({
                         success: false,
                         message: `Only ${role}s are allowed to access this route.`,
                    });
                    return;
               }
               return next();
          } catch (error) {
               res.status(500).json({
                    success: false,
                    message: "Error checking role",
               });
               return;
          }
     };
}

export default checkRole;