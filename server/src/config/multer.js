// config/multer.js

import multer from 'multer';
import path from 'path'; // <-- Perbaikan utama ada di sini
import { fileURLToPath } from 'url';
import os from 'os';

// Cara standar di ES Modules untuk mendapatkan __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path absolut ke folder 'upload'
const uploadPath = path.join(__dirname, '..', '..', 'upload'); 

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, os.tmpdir());
  },
  filename: function (req, file, cb) {
    // Menggunakan nama file asli sesuai permintaan
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // Cek mimetype file
  if (file.mimetype === 'application/pdf') {
    // Jika file adalah PDF, izinkan upload
    cb(null, true);
  } else {
    // Jika bukan PDF, tolak upload dengan memberikan error
    cb(new Error('Hanya file dengan format PDF yang diizinkan!'), false);
  }
}

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter
 });

export { upload };