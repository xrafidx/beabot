import {Router} from 'express';
// auth
import { isAuthenticated } from '../middlewares/authentication.middlewares.js';
// controller
import { getEssayDrivenQuestion,getRegularQuestion,createEssayDrivenQuestion,createRegularQuestion } from '../controllers/question.controller.js';
const router = Router();

// multer
import { upload } from "../config/multer.js";


// dapetin pertanyaan reguler
router.get('/question-regular/:cardsid', isAuthenticated,getRegularQuestion);

// dapetin pertanyaan essaydriven
router.get('/question-essay/:cardsid', isAuthenticated,getEssayDrivenQuestion);

// generate pertanyaan reguler
router.post('/question-regular/:cardsid', isAuthenticated,upload.single('essay'),createRegularQuestion);

// generate pertanyaan essaydriven
router.post('/question-essay/:cardsid', isAuthenticated,upload.single('essay'),createEssayDrivenQuestion);

export {router}