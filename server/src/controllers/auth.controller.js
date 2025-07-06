import * as authServices from '../services/auth.services.js'

export async function login(req,res,next){

}

export async function register(req,res,next){
    const name = req.body.name;
    const email = req.body.email;
    const plainPassword = req.body.password;
    console.log(name,email,plainPassword)
    // add new user
    try {
        const newUser = await authServices.newUser(name,email,plainPassword);
        res.status(201).json({ message: "Registrasi berhasil", data: newUser });
    } catch (error) {
        next(error);
    }
}

export async function logout(req,res,next){

}

