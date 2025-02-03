import express from "express";
import influencerSignupController from "@/controllers/influencerController";

const router = express.Router(); 
router.post('/auth/sign-up',influencerSignupController);

export default router;

