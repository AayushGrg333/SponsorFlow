import dotenv from 'dotenv';
dotenv.config();
import express, {Request,Response} from 'express';
import influencerRoutes from './routes/influencerRoutes'
import companyRoutes from './routes/companyRoutes';
import authRoutes from './routes/auth/authRoutes';

//connect mongodb
import connectDB from './config/connnectdb';

const app  = express();
const PORT = process.env.PORT || 3000;

connectDB();

//Middleware
app.use(express.json());

//Routes
app.use("/api/influencer",influencerRoutes);
app.use("/api/company",companyRoutes);
app.use("/api/auth",authRoutes)



app.listen(PORT,()=>{
  console.log(`Server is running at ${PORT}`)
})