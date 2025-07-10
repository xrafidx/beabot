import prisma from "../config/prisma.js";
export async function addCards(uid,namaBeasiswa,banyakPertanyaan,jenisPertanyaan,bahasa) {
    try {
        const cards = await prisma.$queryRaw`
        INSERT INTO "interviewcard" (userid, namabeasiswa, banyakpertanyaan, jenisinterview, bahasa)
        VALUES (${uid},${namaBeasiswa},${banyakPertanyaan},${jenisPertanyaan}, ${bahasa})
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