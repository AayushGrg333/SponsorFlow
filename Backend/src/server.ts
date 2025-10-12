import { config } from "./config/config";
import express from "express";
import influencerRoutes from "./routes/influencerRoutes";
import companyRoutes from "./routes/companyRoutes" 
import authRoutes from "./routes/auth/authRoutes";
import session from "express-session";
import cookieParser from "cookie-parser";
import verifyToken from './middlewares/verifytoken'
import checkRole from "./middlewares/rolecheck";
import { errorHandler } from "./middlewares/errorHandler";
import { Request, Response } from "express";

//import for socket.io
import http from "http"; 
import {Server} from "socket.io";
import cors from "cors";

//connect mongodb
import connectDB from "./config/connnectdb";

//authtication import
import passport from "../src/config/passportSetup";
import Apiresponse from "./utils/apiresponse";

const app = express();
const PORT = config.PORT || 8000;
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Listen for new socket connections
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  socket.on("chatMessage", (msg) => {
  console.log("📩 Message received:", msg);
  io.emit("chatMessage", msg); // send to everyone
  });

  // Example: handle user disconnect
  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

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



app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});