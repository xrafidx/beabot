
import { jwtvalidate } from "../config/JWT.js";
import { blacklistCheck } from "../services/auth.services.js";
// buat autentikasi route protection
export async function isAuthenticated(req,res,next){
    try {
    // kita akses cookiesnya
    const JWTuser = req.cookies.accessToken;
    if(!JWTuser){
        return res.status(401).json({
        success: false,
        message: 'Token Not Found, Access Denied'
      });
    }
    // kita verifikasi apakah JWT asli atau tidak dan expired atau tidak
    const validationResult = jwtvalidate(JWTuser);
    // kita verifikasi apakah JWT ada di blacklist atau tidak
    const blacklistResult = await blacklistCheck(validationResult);
    // kalo berhasil verifikasi, tambahin data user ke situ.
    req.user = validationResult;
    next();
    } catch (error) {
        // Unauthorized access
        res.status(401).send({
            success: false,
            message: "Unauthorized Access"
        })
    }
}