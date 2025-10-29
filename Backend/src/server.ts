import { config } from "./config/config";
import express,{Request,Response} from "express";
import influencerRoutes from "./routes/influencerRoutes";
import companyRoutes from "./routes/companyRoutes" 
import authRoutes from "./routes/auth/authRoutes";
import session from "express-session";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler";
import Redis from "./config/redis";
import healthRoutes from "./routes/healthRoutes";
//import for socket.io
import http from "http"; 
import {Server} from "socket.io";
import { setupSocket } from "./socket/socket";

//connect mongodb
import connectDB from "./config/connnectdb";

//authtication import
import passport from "../src/config/passportSetup";
import Apiresponse from "./utils/apiresponse";

const app = express();
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials:true,
  },
});

async function initConnections() {
  await Redis.connectRedis();
  await connectDB();
}

initConnections().catch(err => console.error(err));
//initialize socket
setupSocket(io)


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
app.use("/health", healthRoutes);


app.use("/", (req:Request, res:Response) => {
  res.json({
    message: "API is running",
  })
});
app.use(errorHandler);

const PORT = config.PORT || 8000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));