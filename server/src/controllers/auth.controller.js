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
        
        // send jwt via cookies
        res.cookie('accessToken', JWT, {
            httpOnly: true,
            secure: true,
            sameSite: 'Lax',
            maxAge: 2 * 24 * 60 * 60 * 1000 // 2 hari sama kaya JWT
        })

        // status message
        res.status(200).json({
            success:true,
            message:'Login berhasil'
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

        // send JWT via cookies
        res.cookie('accessToken', userJWT, {
            httpOnly: true,
            secure: true,
            sameSite: 'Lax',
            maxAge: 2 * 24 * 60 * 60 * 1000 // 2 hari sama kaya JWT
        })

        // Respond message
        res.status(201).json({ 
            success: true,
            message: "Registrasi berhasil", 
        });
        
    } catch (error) {
        next(error);
    }
}

export async function logout(req,res,next){
    try {
    // ngambil token
    const token = req.cookies.accessToken
    console.log('CONTROLLER TOKEN',token)
    // ngeblacklist token
    const result = authServices.blacklistToken(token);
    res.status(200).json({
        success: true,
        message: "Logout berhasil."
    });     
    } catch (error) {
        next(error);
    }
}

export async function dashboard(req,res,next){
        res.status(200).json({
        success: true,
        message: "Akses Diberikan"
    });
}

