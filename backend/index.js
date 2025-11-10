import express from 'express';
import dotenv from 'dotenv';
import sqlConnection from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import protectedRoutes from './routes/protectedRoutes.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';


dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;

sqlConnection.connect((err)=>{
    if(err){
        console.log("Database connection failed " , err);
    }
    else{
        console.log("Database connected successfully");
    }
})


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'Navyut College API',
    version: '1.0.0'
  });
});


app.use("/api/auth" , authRoutes);
app.use("/api/user" , protectedRoutes);

// Error handling middlewares (must be last)
app.use(notFound);
app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

