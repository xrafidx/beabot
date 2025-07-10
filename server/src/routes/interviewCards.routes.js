import {Router} from 'express';

import { createCardsController,editCardsController,deleteCardsController, getCardsController, getCardByIdController } from '../controllers/interviewCards.controller.js';

import { isAuthenticated } from '../middlewares/authentication.middlewares.js';
const router = Router();


// CRUD CARDS

// Ambil semua data kartu sesuai pengguna.
router.get('/cards', isAuthenticated, getCardsController);

// ambil data kartu spesifik sesuai pengguna.
router.get('/cards/:id', isAuthenticated, getCardByIdController);


// Buat Kartu
router.post('/cards', isAuthenticated, createCardsController);


// Edit Kartu
router.patch('/cards',isAuthenticated, editCardsController);


// Hapus Kartu
router.delete('/cards',isAuthenticated, deleteCardsController);

export default router;