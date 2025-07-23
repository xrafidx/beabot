import prisma from "../config/prisma.js";
export async function getNamaBeasiswa(cardsId){
    try {
    const result = await prisma.$queryRaw`
    SELECT "namabeasiswa","banyakpertanyaan","bahasa","userid" FROM "interviewcard" WHERE id = ${cardsId};
    `
    const namaBeasiswa = result[0].namabeasiswa;
    const banyakPertanyaan = result[0].banyakpertanyaan;
    const bahasa = result[0].bahasa;
    const userid = result[0].userid;
    return {namaBeasiswa,banyakPertanyaan,bahasa,userid};
    } catch (error) {
        console.error("Error in getNamaBeasiswa repositories");
        throw error;
    }
}


export async function getName(cardsId){
    try {
    // cari userID
    const result = await prisma.$queryRaw`
      SELECT u.name
      FROM "user" u
      JOIN "interviewcard" ic ON u.id = ic.userid
      WHERE ic.id = ${cardsId};
    `;
    return result[0].name;

    } catch (error) {
        console.error("Error in getName repositories");
        throw error
    }
}

export async function saveQuestion(userid,cardsId,rawData,tanggal,essaydriven){
    try {
        await prisma.$queryRaw`
        INSERT INTO "question" (userid, cardsid, question, createdat, essaydriven)
        VALUES (${userid}, ${cardsId}, ${rawData}::jsonb, ${tanggal}, ${essaydriven})
        ON CONFLICT (cardsid) DO UPDATE SET
            question = EXCLUDED.question,
            createdat = EXCLUDED.createdat;
        `;
  
    } catch (error) {
        console.error("Error in saveQuestion repositories");
        throw error
    }
}

export async function getQuestion(cardsId){
    try {
        const data = await prisma.$queryRaw`
      SELECT "question" FROM "question" WHERE cardsid = ${cardsId};
        `
        return data[0].question;
        
    } catch (error) {
        console.error("Error in getQuestion");
        throw error
    }
}

export async function updateCardstoGenerated(cardsId){
    try {
        const result = await prisma.$executeRaw`
        UPDATE "interviewcard"
        SET "status" = 'QUESTIONS_GENERATED'::interviewstatus
        WHERE "id" = ${cardsId}`
        return result;
    } catch (error) {
        console.error("Error in updateCardstoGenerated repositories");
        throw error;
    }
}
