import express from "express";
import dotenv from "dotenv";
import { __filename,__dirname } from "./utils/path.js";
import authRoutes from './routes/auth.routes.js';
import errorHandler from "./middlewares/errorHandler.middlewares.js";
import cors from 'cors';
import cookieParser from 'cookie-parser'

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(cors())

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.use('/',authRoutes);


// error handling
app.use(errorHandler);

app.listen(PORT,()=>{
    console.log(`Server ini berjalan di port ${PORT}`);
})