import { essayReviewPrompt } from "../services/essayReview.services.js"


export async function essayReview(req,res,next){
    try {
        // PROMPT AI ESSAY REVIEW
        const namaFile = req.file.originalname;
        const result = await essayReviewPrompt(namaFile);
        res.status(200);
    } catch (error) {
        if(error.message === 'Error in essayReview services'){
            return res.status(502).json({
                success: false,
                message: 'Gagal memproses dokumen dengan layanan AI. Silakan coba lagi nanti.'
            });
        }
        next(error);
    }
}