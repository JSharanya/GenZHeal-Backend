import virualclubRoutes from './routes/virualclub.routes.js'
import authRoutes from './routes/auth.routes.js'
// const virualclubRoutes = require('./routes/virualclub.routes.js');
import commentRoutes from './routes/discussion.routes.js'
import appointmentRoutes from "./routes/appointment.route.js";
import userRoutes from "./routes/user.routes.js";

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

const app = express()


app.use(cors())
app.use(express.json())
app.use(cookieParser())


app.use('/api/virualclub',virualclubRoutes);
app.use('/api/auth',authRoutes)
app.use('/api/comment',commentRoutes)
app.use("/api/appointment", appointmentRoutes);
app.use('/api/user',userRoutes)



dotenv.config()

mongoose.connect(process.env.MONGO,{
  useNewUrlParser: true, 
   useUnifiedTopology: true,
  // writeConcern: { w: 'majority', wtimeout: 5000 }
})
.then(()=>{
    console.log('Mongodb is connected');
})
.catch((err)=>{
    console.log(err);
})


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(3000, () => {
  console.log(`Example app listening on port 3000`)
})


app.use((err,req,res,next)=>{
    const statusCode=err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    })
})
