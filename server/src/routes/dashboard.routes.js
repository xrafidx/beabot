// import file router

import { Router } from "express";

// import middleware authentication
import {isAuthenticated} from "../middlewares/authentication.middlewares.js";



const router = Router();


// kalo dashboard diakses
router.get('/dashboard');