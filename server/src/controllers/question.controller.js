import { createRegQuestion, findRegQuestion, createEssQuestion, findEssQuestion, updateCardsStatus, hapusFile } from "../services/question.services.js";

export async function getRegularQuestion(req,res,next){
    try {
    // id params
    const cardsId = Number(req.params.cardsid);
    // jalanin service buat dapetin question reguler
    const result = await findRegQuestion(cardsId);

    res.status(201).json({
        success: true,
        message: "Data Ditemukan",
        response: result
    })
    } catch (error) {
        next(error);
    }
}
export async function getEssayDrivenQuestion(req,res,next){
    try {
    // id params
    const cardsId = Number(req.params.cardsid);
    // jalanin service buat dapetin question reguler
    const result = await findEssQuestion(cardsId);

    res.status(201).json({
        success: true,
        message: "Data Ditemukan",
        response: result
    })
    } catch (error) {
        next(error);
    }

}

export async function createRegularQuestion(req,res,next){
    try {
    // id params
    const cardsId = Number(req.params.cardsid);
    // jalanin service buat create pertanyaan biasa
    const result = await createRegQuestion(cardsId);  

    // jalanin service buat update status di interviewcards
    const cards = await updateCardsStatus(cardsId);

    res.status(201).json({
        success: true,
        message: "Data Berhasil Dibuat",
        response: result
    })
    } catch (error) {
        next(error);
    }
}

export async function createEssayDrivenQuestion(req,res,next){
    try {
        const cardsid = Number(req.params.cardsid);
        const dataFile = req.file;
        const result = await createEssQuestion(cardsid,dataFile);
         // jalanin service buat update status di interviewcards
        const cards = await updateCardsStatus(cardsid);
        // const hapus = await hapusFile(dataFile);


        res.status(201).json({
            success: true,
            message: "Data Berhasil Dibuat",
            response: result
        })

    } catch (error) {
        next(error);
    }

}