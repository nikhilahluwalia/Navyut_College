import express from 'express';
import dotenv from 'dotenv';
import sqlConnection from './config/db.js';
import authRoutes from './routes/authRoutes.js';


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
  res.send('Hello World!');
});


app.use("/api/auth" , authRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

