import prisma from "../config/prisma.js";
export async function addCards(uid,namaBeasiswa,banyakPertanyaan,jenisPertanyaan,bahasa,judulInterview,tanggal,imageurl) {
    try {
        const cards = await prisma.$queryRaw`
            INSERT INTO "interviewcard" (userid, namabeasiswa, banyakpertanyaan, jenisinterview, bahasa, judulinterview, tanggal, imageurl)
            VALUES (${uid}, ${namaBeasiswa}, ${banyakPertanyaan}, ${jenisPertanyaan}, ${bahasa}, ${judulInterview}, ${tanggal}, ${imageurl})
            RETURNING id;`; // Cukup kembalikan ID
        return cards[0];

    } catch (error) {
        throw error;
    }
}

export async function getAllCards(uid){
    try {
        const cards = await prisma.$queryRaw`
            SELECT id, "judulinterview", "namabeasiswa", "tanggal", "imageurl", "jenisinterview", "bahasa"
            FROM "interviewcard" 
            WHERE "userid" = ${uid}
            ORDER BY "tanggal" DESC;`; // Urutkan dari yang terbaru
        return cards;
    } catch (error) {
        throw error;
    }
}

export async function getSpecificCards(uid,cardId){
    try {
        const cards = await prisma.$queryRaw`
            SELECT id, userid, "judulinterview", "namabeasiswa", "banyakpertanyaan", "jenisinterview", "bahasa", "tanggal", "imageurl"
            FROM "interviewcard" 
            WHERE "userid" = ${uid} AND "id" = ${cardId};`;
        return cards;
    } catch (error) {
        throw error;
    }
}

export async function deleteSpecificCard(uid,cardId){
    try {
        const card = await prisma.$queryRaw`
            DELETE FROM "interviewcard"
            WHERE userid = ${uid} AND id = ${cardId}
            RETURNING id;`; // Cukup kembalikan ID sebagai konfirmasi
        return card;
    } catch (error) {
        throw error;
    }
}

export async function editSpecificCards(cardId,uid,namaBeasiswa,banyakPertanyaan,jenisPertanyaan,bahasa,judulInterview,tanggal,imageurl){
    try {
        
        const card =  await prisma.$queryRaw`
            UPDATE "interviewcard"
            SET namabeasiswa = ${namaBeasiswa}, banyakpertanyaan = ${banyakPertanyaan}, jenisinterview = ${jenisPertanyaan}, bahasa = ${bahasa}, imageurl = ${imageurl}, judulinterview = ${judulInterview}, tanggal = ${tanggal}
            WHERE id = ${cardId} AND userid = ${uid}
            RETURNING *;
        `
        return card;
    } catch (error) {
        throw error;
    }
}