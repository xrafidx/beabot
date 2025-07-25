import { jwtvalidate } from "../config/JWT.js";
import { blacklistCheck } from "../services/auth.services.js";

// buat autentikasi route protection
export async function isAuthenticated(req, res, next) {
  try {
    // Ambil token dari header Authorization
    const authHeader = req.headers.authorization;
    const JWTuser = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

    if (!JWTuser) {
      return res.status(401).json({
        success: false,
        message: 'Token Not Found, Access Denied'
      });
    }

    // Verifikasi apakah JWT valid dan belum expired
    const validationResult = jwtvalidate(JWTuser);

    // Cek apakah token ada di blacklist
    const blacklistResult = await blacklistCheck(validationResult);

    // Jika semua valid, tambahkan user ke req
    req.user = validationResult;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized Access"
    });
  }
}