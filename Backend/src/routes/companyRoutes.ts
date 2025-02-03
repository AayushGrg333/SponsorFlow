import express from "express";
import companySignupController from "../controllers/companyController";

const router = express.Router(); 
router.post('/auth/sign-up',companySignupController);

export default router;

