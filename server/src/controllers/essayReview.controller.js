import { essayReviewPrompt } from "../services/essayReview.services.js"


export async function essayReview(req,res,next){
    try {
        // PROMPT AI ESSAY REVIEW
        const namaFile = req.file.originalname;
        const result = await essayReviewPrompt(namaFile);
        res.status(200);
    } catch (error) {
        next(error);
    }
}