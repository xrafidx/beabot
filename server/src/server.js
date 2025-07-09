
// import express
import express from "express";

// access file .env
import dotenv from "dotenv";

// buat filename dirname
import { __filename,__dirname } from "./utils/path.js";

// routes buat authentication
import authRoutes from './routes/auth.routes.js';

// middleware error handler
import errorHandler from "./middlewares/errorHandler.middlewares.js";

// ini biar aplikasi dari port yang beda bisa communicate
import cors from 'cors';

// ini buat parsing data dari cookie
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

// auth routes
app.use('/api/v1/auth', authRoutes);

// dashboard routes
app.use('/api/v1', );

// essay-review routes


// error handling
app.use(errorHandler);

app.listen(PORT,()=>{
    console.log(`Server ini berjalan di port ${PORT}`);
})