import * as authServices from '../services/auth.services.js'

export async function login(req,res,next){
    // ngambil email
    const email = req.body.email;
    // ngambil passwordplain
    const plainPassword = req.body.password;
    try {
    // verifikasi user
    const userData = await authServices.verifyUser(email,plainPassword);
        // craft JWT
        const JWT = authServices.craftToken(userData);
        res.status(200).json({
            success:true,
            message:'Login berhasil',
            data:{
                Token: JWT
            }
        })
    } catch (error) {
        next(error);
    }
}


export async function register(req,res,next){
    const {name,email,password: plainPassword} = req.body;
    try {
        // add new user
        let newUser = await authServices.newUser(name,email,plainPassword);
        // craft JWT Token
        const userJWT = authServices.craftToken(newUser);
        res.status(201).json({ message: "Registrasi berhasil", data: {
            token: userJWT
        } });
    } catch (error) {
        next(error);
    }
}

export async function logout(req,res,next){
    // Tidak ada logic yang perlu dilakukan di server untuk JWT stateless
    res.status(200).json({
        success: true,
        message: "Logout berhasil."
    });
}

