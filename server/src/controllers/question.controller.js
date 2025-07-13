import { createRegQuestion, findRegQuestion } from "../services/question.services.js";
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
    // id params

}

export async function createRegularQuestion(req,res,next){
    try {
    // id params
    const cardsId = Number(req.params.cardsid);
    // jalanin service buat create pertanyaan biasa
    const result = await createRegQuestion(cardsId);  

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
    const cardsid = req.params.cardsid;
}