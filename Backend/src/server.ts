import dotenv from 'dotenv';
dotenv.config();
import express, {Request,Response} from 'express';
import influencerRoutes from './routes/influencerRoutes'

//connect mongodb
import connectDB from './config/connnectdb';

const app  = express();
const PORT = process.env.PORT || 3000;

connectDB();

//Middleware
app.use(express.json());

//Routes
app.use("/api",influencerRoutes);


app.get('/', (req: Request, res: Response) => {
  res.send('This is the home page!');
});

app.listen(PORT,()=>{
  console.log(`Server is running at ${PORT}`)
})