import prisma from "../config/prisma.js";
export async function addCards(uid,namaBeasiswa,banyakPertanyaan,jenisPertanyaan,bahasa,judulInterview,tanggal,imageurl,intialstatus) {
    try {
    const cards = await prisma.$queryRaw`
        INSERT INTO "interviewcard" (userid, namabeasiswa, banyakpertanyaan, jenisinterview, bahasa, judulinterview, tanggal, imageurl, status)
        VALUES (${uid}, ${namaBeasiswa}, ${banyakPertanyaan}, ${jenisPertanyaan}, ${bahasa}, ${judulInterview}, ${tanggal}, ${imageurl}, ${intialstatus}::interviewstatus)
        RETURNING id;`; // Tambahkan ::interviewstatus untuk melakukan CAST

    return cards[0];

    } catch (error) {
        throw error;
    }
}

export async function getAllCards(uid){
    try {
    const cards = await prisma.$queryRaw`
        SELECT id, "judulinterview", "namabeasiswa", "tanggal", "imageurl", "jenisinterview", "bahasa", "status"
        FROM "interviewcard" 
        WHERE "userid" = ${uid}
        ORDER BY "tanggal" DESC;`; // Ganti "interviewstatus" menjadi "status"
    return cards;
    } catch (error) {
        throw error;
    }
}

export async function getSpecificCards(uid,cardId){
    try {
        const cards = await prisma.$queryRaw`
            SELECT id, userid, "judulinterview", "namabeasiswa", "banyakpertanyaan", "jenisinterview", "bahasa", "tanggal", "imageurl", "status"
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

export async function editSpecificCards(cardId,uid,namaBeasiswa,banyakPertanyaan,jenisPertanyaan,bahasa,judulInterview,tanggal,imageurl,interviewstatus){
    try {
        
        const card =  await prisma.$queryRaw`
            UPDATE "interviewcard"
            SET namabeasiswa = ${namaBeasiswa}, banyakpertanyaan = ${banyakPertanyaan}, jenisinterview = ${jenisPertanyaan}, bahasa = ${bahasa}, imageurl = ${imageurl}, judulinterview = ${judulInterview}, tanggal = ${tanggal}, status = ${interviewstatus}::interviewstatus
            WHERE id = ${cardId} AND userid = ${uid}
            RETURNING *;
        `
        return card;
    } catch (error) {
        throw error;
    }
}

export async function deleteFeedback(cardId){
    try {
        const feedback = await prisma.$queryRaw`
            DELETE FROM "feedback"
            WHERE cardsid = ${cardId}
            RETURNING *;`; 
        return feedback;
    } catch (error) {
        console.error("Error in deleteFeedback repositories");
        throw error;
    }
}

export async function deleteQuestion(cardId){
    try {
        const feedback = await prisma.$queryRaw`
            DELETE FROM "question"
            WHERE cardsid = ${cardId}
            RETURNING *;`; 
        return feedback;
    } catch (error) {
        
    }
}