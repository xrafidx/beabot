// import file router

import { Router } from "express";

// import middleware authentication
import {isAuthenticated} from "../middlewares/authentication.middlewares.js";

// controller essay review
import { essayReview,specificEssay,allEssay,deleteEssay} from "../controllers/essayReview.controller.js";

// multer
import { upload } from "../config/multer.js";


const router = Router();

// buat akses essay review
// itu yang parameter uploadnya diisi sama nama form htmlnya file gitu
router.post('/essay-review',isAuthenticated,upload.single('essay'), essayReview);

// buat ambil all essay cards
router.get('/essay-review',isAuthenticated,allEssay);
// buat ambil spesifik essay cards
router.get('/essay-review/:essayid',isAuthenticated,specificEssay);
// buat hapus specific essay cards
router.get('/essay-review/:essayid',isAuthenticated, deleteEssay);

export default router;

