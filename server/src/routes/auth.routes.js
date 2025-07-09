// import file router
import { Router } from "express";
// import file controller
import * as authController from '../controllers/auth.controller.js'
import {isAuthenticated} from "../middlewares/authentication.middlewares.js";
import { registerRules,loginRules,handleValidationErrors } from "../middlewares/validators.middlewares.js";


const router = Router();

// kalo user login
router.post('/sign-in', loginRules, handleValidationErrors, authController.login);

// kalo user register
router.post('/register', registerRules, handleValidationErrors, authController.register);

// kalo user logout
router.post('/logout', isAuthenticated ,authController.logout);



export default router