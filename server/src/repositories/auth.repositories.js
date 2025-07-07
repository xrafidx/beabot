import prisma from '../config/prisma.js'
export async function findUser(email){
    try {
        const user =  await prisma.$queryRaw`SELECT * from "user" WHERE email = ${email}`
        return user[0];
    } 
    catch (error) {
        console.error("Database error in findUser:", error);
        throw error;
    }
}
export async function createUser(name,email,hashedPass){
    console.log("DEBUG: Hashed Password Type (to Prisma):", typeof hashedPass);
    try {
        console.log(name)
        const newUser = await prisma.$queryRaw`
            INSERT INTO "user"(name, email, hashedpassword) 
            VALUES(${name}, ${email}, ${hashedPass}) 
            RETURNING id, name, email, hashedpassword; 
        `
        return newUser;
    }   
    catch (error) {
        console.error('Database Error in createUser',error);
        throw error
    }
}