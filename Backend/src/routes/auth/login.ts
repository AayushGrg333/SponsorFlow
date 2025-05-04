import express from "express";

const router = express.Router();

router.post('/auth/login',loginController);

export default router;