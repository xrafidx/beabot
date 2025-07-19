import {Router} from 'express';
// auth
import { isAuthenticated } from '../middlewares/authentication.middlewares.js';
// import controller
import { getUserController } from '../controllers/user.controller.js';

const router = Router();

// untuk mendapatkan data user
router.get('/user-data', isAuthenticated, getUserController);

export {router};