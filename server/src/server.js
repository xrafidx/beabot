
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

// routes buat essay review
import essayReviewRoutes from './routes/essayReview.routes.js';

// cards routes
import cardRoutes from "./routes/interviewCards.routes.js";

// question routes
import {router as questionRoutes} from "./routes/question.routes.js";

// vapi webhook
import {router as vapiWebHookRoutes} from "./routes/vapiwebhook.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(cors({
    origin:'http://localhost:3000', // FE
    credentials: true
}))

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes

// auth routes
app.use('/api/v1/auth', authRoutes);



// essay-review routes
app.use('/api/v1', essayReviewRoutes);

// cards routes
app.use('/api/v1', cardRoutes);

// question routes
app.use('/api/v1', questionRoutes);

// VAPI webhook

app.use('/api/v1', vapiWebHookRoutes);


// error handling
app.use(errorHandler);

app.listen(PORT,()=>{
    console.log(`Server ini berjalan di port ${PORT}`);
})