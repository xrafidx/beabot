import prisma from "../config/prisma.js";
export async function addCards(uid,namaBeasiswa,banyakPertanyaan,jenisPertanyaan,bahasa,judulInterview,tanggal,imageurl) {
    try {
        const cards = await prisma.$queryRaw`
        INSERT INTO "interviewcard" (userid, namabeasiswa, banyakpertanyaan, jenisinterview, bahasa, judulinterview, tanggal, imageurl)
        VALUES (${uid},${namaBeasiswa},${banyakPertanyaan},${jenisPertanyaan}, ${bahasa}, ${judulInterview}, ${tanggal}, ${imageurl})
        RETURNING *`
        return cards[0];

    } catch (error) {
        throw error;
    }
}

export async function getAllCards(uid){
    try {
        const cards = await prisma.$queryRaw`
        SELECT * FROM "interviewcard" WHERE "userid" = ${uid};
        `
        return cards;
    } catch (error) {
        throw error;
    }
}

export async function getSpecificCards(uid,cardId){
    try {
    const cards = await prisma.$queryRaw`
        SELECT * FROM "interviewcard" WHERE "userid" = ${uid} AND "id" = ${cardId};
        `
    return cards;
    } catch (error) {
        throw error;
    }
}

export async function deleteSpecificCard(uid,cardId){
    try {
        const card =  await prisma.$queryRaw`
        DELETE FROM "interviewcard"
        WHERE userid = ${uid} AND id = ${cardId}
        RETURNING *;
        `
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