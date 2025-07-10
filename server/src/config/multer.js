// config/multer.js

import multer from 'multer';
import path from 'path'; // <-- Perbaikan utama ada di sini
import { fileURLToPath } from 'url';

// Cara standar di ES Modules untuk mendapatkan __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path absolut ke folder 'upload'
const uploadPath = path.join(__dirname, '..', '..', 'upload'); 

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Menggunakan nama file asli sesuai permintaan
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

export { upload };