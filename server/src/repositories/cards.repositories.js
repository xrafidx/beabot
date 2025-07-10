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