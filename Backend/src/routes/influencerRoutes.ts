import express from "express";
import { influencerSignup } from "../controllers/influencerController";

const router = express.Router(); 
router.post('/auth/sign-up',influencerSignup);

export default router;

