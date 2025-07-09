// middlewares/validators.js
import { body } from 'express-validator';
import { validationResult } from 'express-validator';

export const registerRules = [
  // Memeriksa field 'email'
  body('email')
    .isEmail().withMessage('Format email tidak valid.')
    .normalizeEmail(), // Membersihkan format email

  // Memeriksa field 'password'
  body('password')
    .notEmpty().withMessage('Password harus diisi.'),

  // Memeriksa field 'name'
  body('name')
    .notEmpty().withMessage('Nama tidak boleh kosong.')
    .trim() // Menghapus spasi di awal/akhir
    .escape() // Menghapus karakter HTML berbahaya
];

export const loginRules = [
  // Memeriksa field 'email'
  body('email')
    .isEmail().withMessage('Format email tidak valid.')
    .normalizeEmail(), // Membersihkan format email

  // Memeriksa field 'password'
  body('password')
    .notEmpty().withMessage('Password harus diisi.'),

];


export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);
    return res.status(400).json({ 
        success: false,
        errors: errorMessages });
  }
  // Jika tidak ada error, lanjutkan ke controller
  next();
};