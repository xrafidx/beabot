import {Router} from 'express';

import { createCardsController,editCardsController,deleteCardsController, getCardsController, getCardByIdController } from '../controllers/interviewCards.controller.js';

import { isAuthenticated } from '../middlewares/authentication.middlewares.js';

import { upload } from '../config/multer.js';
const router = Router();


// CRUD CARDS

// Ambil semua data kartu sesuai pengguna.
router.get('/cards', isAuthenticated, getCardsController);

// ambil data kartu spesifik sesuai pengguna.
router.get('/cards/:id', isAuthenticated, getCardByIdController);


// Buat Kartu
router.post('/cards', isAuthenticated,upload.single('essay'), createCardsController);


// Edit Kartu
router.put('/cards/:id',isAuthenticated,upload.single('essay'), editCardsController);


// Hapus Kartu
router.delete('/cards/:id',isAuthenticated, deleteCardsController);

export default router;