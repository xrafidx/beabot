import prisma from "../config/prisma.js"

export async function createEssay(uid,data){
    try {
        const result = await prisma.essaycard.create({
            data: {
            aireview: data,

            // Gunakan 'author' untuk membuat relasi
            author: {
                // Gunakan 'connect' untuk menghubungkan ke user yang sudah ada
                connect: {
                id: uid, // Hubungkan ke user dengan ID ini
                },
            },
            },
        })
        return result;
    } catch (error) {
        console.error('Error pada createEssay di repositories');
        throw error;
    }

}

export async function searchSpecificEssay(essayid,uid){
    try {
        const result = await prisma.$queryRaw`
        SELECT * FROM "essaycard" WHERE id = ${essayid} AND userid = ${uid}
        `
        return result[0];
    } catch (error) {
        console.error('Error pada searchSpecificEssay di repositories');
        throw error; 
    }
    
}

export async function searchAllEssay(uid){
    try {
        const result = await prisma.$queryRaw`
        SELECT * FROM "essaycard" WHERE userid = ${uid}
        `
        return result[0];
    } catch (error) {
        console.error('Error pada searchSpecificEssay di repositories');
        throw error; 
    }
}
