import dotenv from "dotenv";
dotenv.config();
import express from "express";
import influencerRoutes from "./routes/influencerRoutes";
import companyRoutes from "./routes/companyRoutes" 
import authRoutes from "./routes/auth/authRoutes";
import session from "express-session";
import cookieParser from "cookie-parser";
import verifyToken from './middlewares/verifytoken'
import checkRole from "./middlewares/rolecheck";
import { errorHandler } from "./middlewares/errorHandler";

//connect mongodb
import connectDB from "./config/connnectdb";

//authtication import
import passport from "../src/config/passportSetup";
import Apiresponse from "./utils/apiresponse";

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
  return Apiresponse.success(res, "Welcome to the Influencer Marketing API", null);
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
});
