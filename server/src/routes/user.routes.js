import {Router} from 'express';
// auth
import { isAuthenticated } from '../middlewares/authentication.middlewares.js';

const router = Router();

router.get('/user-data', isAuthenticated);

export {router};