import * as authRepositories from '../repositories/auth.repositories.js';
import * as password from '../utils/password.js';
export async function newUser(name,email,plainPassword){
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
    // store email,password, sama hash
    const newUser = await authRepositories.createUser(name,email,hashedPass);
    console.log("New User Created");
    delete newUser.hashedPassword;
    return newUser;
}