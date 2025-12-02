import { config } from "./config/config";
import express, { Request, Response } from "express";
import influencerRoutes from "./routes/influencerRoutes";
import companyRoutes from "./routes/companyRoutes";
import authRoutes from "./routes/auth/authRoutes";
import session from "express-session";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler";
import healthRoutes from "./routes/healthRoutes";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { setupSocket } from "./socket/socket";
import connectDB from "./config/connnectdb";
import passport from "../src/config/passportSetup";

const app = express();
const server = http.createServer(app);

// CORS configuration
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3001"], // Add your frontend URLs
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200
};

// Apply CORS BEFORE other middleware
app.use(cors(corsOptions));

// Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

async function initConnections() {
  await connectDB();
}

initConnections().catch(err => console.error(err));

// Initialize socket
setupSocket(io);

// Middleware - order matters!
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_default_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/influencer", influencerRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/auth", authRoutes);
app.use("/health", healthRoutes);

app.get("/ping", (req: Request, res: Response) => {
  res.status(200).send("pong");
});

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "API is running",
  });
});

app.use(errorHandler);

const PORT = config.PORT || 8000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))