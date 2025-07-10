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

export async function editSpecificCards(cardId,uid,namaBeasiswa,convertedBanyakPertanyaan,jenisPertanyaan,bahasa){
    try {
        
        const card =  await prisma.$queryRaw`
            UPDATE "interviewcard"
            SET namabeasiswa = ${namaBeasiswa}, banyakpertanyaan = ${convertedBanyakPertanyaan}, jenisinterview = ${jenisPertanyaan}, bahasa = ${bahasa}
            WHERE id = ${cardId} AND userid = ${uid}
            RETURNING *;
        `
        return card;
    } catch (error) {
        throw error;
    }
}