// import file router

import { Router } from "express";

// import middleware authentication
import {isAuthenticated} from "../middlewares/authentication.middlewares.js";

// controller essay review
import { essayReview } from "../controllers/essayReview.controller.js";



const router = Router();

// buat akses essay review
router.post('/essay-review',isAuthenticated, essayReview);

export default router;