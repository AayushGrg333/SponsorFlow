import dotenv from "dotenv";
dotenv.config();
import express from "express";
import influencerRoutes from "./routes/influencerRoutes";
import companyRoutes from "./routes/companyRoutes" 
import authRoutes from "./routes/auth/authRoutes";
import session from "express-session";
import cookieParser from "cookie-parser";
import verifyToken from './middlewares/verifytoken'

//connect mongodb
import connectDB from "./config/connnectdb";

//authtication import
import passport from "../src/config/passportSetup";

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

//Middleware
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_default_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());




//Routes
app.use("/api/influencer", influencerRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req,res) => {
  res.status(200).json({
    message: "this is home page"
  })
});

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
});
