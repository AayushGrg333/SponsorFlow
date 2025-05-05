import { RequestHandler } from "express";
import passport from "passport";
import { loginSchema } from "../../../Shared/validations/loginSchema";

const loginController: RequestHandler = async (req, res, next) => {
    try {
        const parsedData = loginSchema.safeParse({
            identifier: req.body.identifier,
            password: req.body.password,
            usertype: req.body.usertype,
        });

        if (!parsedData.success) {
            res.status(400).json({
                success: false,
                message: "invalid login data",
                error: parsedData.error.errors,
            });
            return;
        }

        const { identifier, password, usertype } = parsedData.data;

        const Strategy =
            usertype === "company" ? "company-local" : "influencer-local";

        passport.authenticate(
            Strategy,
            (err: any, user: Express.User | false, info: any) => {
                if (err) return next(err);

                if (!user) {
                    return res.status(401).json({
                        success: false,
                        message: info?.message || "Authentication failed",
                    });
                }
                req.logIn(user, (err)=>{
                    if (err) return next(err);
                    return res.status(200).json({
                         success : true,
                         message : "login successful",
                         user,
                    })
                })
            }
        )(req,res,next);
    } catch (error) {}
};

export default loginController;
