// import file router
import { Router } from "express";
// import file controller
import * as authController from '../controllers/auth.controller.js'
import {isAuthenticated} from "../middlewares/authentication.middlewares.js";


const router = Router();

// kalo user login
router.post('/sign-in', authController.login);

// kalo user register
router.post('/register', authController.register);

// kalo user logout
router.post('/logout', isAuthenticated ,authController.logout);

router.get('/dashboard', isAuthenticated , authController.dashboard);

export default router