// import file router
import { Router } from "express";
// import file controller
import * as authController from '../controllers/auth.controller.js'

const router = Router();

// kalo user login
router.post('/login', authController.login);

// kalo user register
router.post('/register', authController.register);

// kalo user logout
router.post('/logout', authController.logout);

export default router