import * as authRepositories from '../repositories/auth.repositories.js';
import * as password from '../utils/password.js';
import { v4 as uuidv4 } from 'uuid';
import { jwtcreate,jwtvalidate } from '../config/JWT.js';


// crafting JWT Token
export function craftToken(userData){
    const payload = {
        // ini buat retrieve data user liat data userdata.id
        sub: userData.id,
        email:userData.email,
        // ini buat blacklist token
        jti: uuidv4()
    }
    try{
        return jwtcreate(payload);
    }
    catch(error){
        console.error('Error dalam membuat token JWT', error);
        throw new error('Error dalam membuat token JWT');
    }
}


// nambah user baru ke DB sekaligus verify apakah user baru udah ada
export async function newUser(name,email,plainPassword){
    try {
    // cek apakah email udah terdaftar.
    const userRegistered = await authRepositories.findUser(email);
    // kalo udah bikin error
    if(userRegistered){
        throw new Error("Email sudah terdaftar");
    }
    // kalo belum lanjut buat.
    console.log("User is not registered");
    // password dihash
    const hashedPass = await password.hashPass(plainPassword);
    console.log("DEBUG: Hashed Password Type (to Prisma):", typeof hashedPass);
    // store email,password, sama hash
    const newUser = await authRepositories.createUser(name,email,hashedPass);
    console.log("New User Created");
    return newUser;
    } catch (error) {
        // Log error dan lempar kembali agar controller bisa menangkapnya
        console.error("Error di service registrasi:", error);
        throw error;
    }
}

export async function verifyUser(email,plainPassword){
    try {
        // cari email di db
        const user = await authRepositories.findUser(email);
        // kalo user ketemu
        if(user){
            const hashedPass = user.hashedpassword;
            // verify password
            console.log(plainPassword,hashedPass);
            const result = await password.verifyPass(plainPassword,hashedPass);
            // kalo bener
            if(result){
                return user;
            }
            // kalo salah
            else{
                throw new Error("Email atau password anda salah");
            }
        }
        // ini kalo ga ketemu
        else{
            throw new Error("Email atau password anda salah");
        }
        
    } catch (error) {
        console.error("Error in verify user services",error);
        throw new error("Error in verify user services");
    }
}