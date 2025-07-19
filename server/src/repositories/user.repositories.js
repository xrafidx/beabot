import prisma from "../config/prisma.js"
export async function findUser(uid){
    try {
    const user = await prisma.$queryRaw`
    SELECT name, email FROM "user"
    WHERE id = ${uid}
    `; 
    if(user.length < 1){
        throw new Error("Data Tidak Ditemukan");
    }
    return user[0];
    } catch (error) {
        console.error("Error in findUser repositories");
        throw error;
    }

}