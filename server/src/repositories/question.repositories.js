import prisma from "../config/prisma.js";
export async function getNamaBeasiswa(cardsId){
    try {
    const result = await prisma.$queryRaw`
    SELECT * FROM "interviewcard" WHERE id = ${cardsId};
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
    let userId = await prisma.$queryRaw`
    SELECT * FROM "interviewcard" WHERE id = ${cardsId}
    `
    userId = userId[0].userid
    // cari nama usernya.
    let name = await prisma.$queryRaw`
    SELECT * FROM "user" WHERE id = ${userId}
    `
    name = name[0].name;
    return name;

    } catch (error) {
        console.error("Error in getName repositories");
        throw error
    }
}

export async function saveQuestion(userid,cardsId,rawData,tanggal,essaydriven){
    try {
        // validasi udah ada apa belum
        const result = await prisma.$queryRaw`
        SELECT * FROM "question" WHERE userid = ${userid} AND cardsid = ${cardsId}
        `
        // kalo belum ada
        if(result < 1){
            const data = await prisma.$queryRaw`
            INSERT INTO "question"(userid,cardsid,question,createdat,essaydriven)
            VALUES (${userid},${cardsId},${rawData}::jsonb,${tanggal},${essaydriven})`;
        }
        // kalo udah ada
        else{
            const data = await prisma.$queryRaw`
            UPDATE "question" SET question = ${rawData}::jsonb, createdat = ${tanggal} WHERE cardsid = ${cardsId}
            `
        }   
    } catch (error) {
        console.error("Error in saveQuestion repositories");
        throw error
    }
}

export async function getQuestion(cardsId){
    try {
        const data = await prisma.$queryRaw`
        SELECT * FROM "question" WHERE cardsid = ${cardsId}
        `
        return data[0].question;
        
    } catch (error) {
        console.error("Error in getQuestion");
        throw error
    }
}
