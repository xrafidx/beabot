import { essayReviewPrompt,jsonParser, hapusFile } from "../services/essayReview.services.js"


export async function essayReview(req,res,next){
    try {
        // PROMPT AI ESSAY REVIEW
        const namaFile = req.file.originalname;
        const rawResponseText = await essayReviewPrompt(namaFile);
        const jsonMatch = rawResponseText.match(/\{[\s\S]*\}/)
        const parsedResponse = jsonParser(jsonMatch);
        const hapus = await hapusFile(namaFile);
        res.status(200).json({
            result: parsedResponse
        });
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